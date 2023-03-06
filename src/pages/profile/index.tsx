import { AuthContext } from "@/contexts/AuthContext";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Box, Button, Center, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

interface UserProps {
  id: string
  name: string
  email: string
  address: string | null
}

interface ProfileProps {
  user: UserProps,
  premium: boolean
}

export default function Profile({ user, premium }: ProfileProps) {
  const { logoutUser, updateUser } = useContext(AuthContext)
  const [name, setName] = useState(user?.name || "")
  const [address, setAddress] = useState(user?.address || "")
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    // window.location.reload();
  }, [])

  async function handleLogout() {
    await logoutUser()
  }

  async function handleUpdateUser() {
    if (!name) {
      toast.error("Preencha o nome!")
      return
    }
    setLoader(true)
    await updateUser({ name, address })
    setLoader(false)
  }

  return (
    <>
      <Head>
        <title>Minha Conta - Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="flex-start" direction="column">

          <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column">

            <Flex w="100%" direction="row" alignItems="center" justifyContent="flex-start">
              <Heading fontSize="3xl" color="orange.900" mt={6} mb={4} mr={4}>Minha Conta</Heading>
            </Flex>

            <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column" alignItems="center" justifyContent="center" bg="barber.400" gap={5} rounded={4}>

              <Flex direction="column" w="85%" >
                <Text color="white" mb={3} fontSize="xl" fontWeight="bold">Nome da barbearia:</Text>
                <Input color="white" placeholder="Nome da Barbearia" w="100%" bg="gray.900" type="text" size="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Flex>

              <Flex direction="column" w="85%" >
                <Text color="white" mb={3} fontSize="xl" fontWeight="bold">Endereço:</Text>
                <Input color="white" placeholder="Endereço da Barbearia" w="100%" bg="gray.900" type="text" size="lg"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Flex>

              {/* <Flex direction="column" w="85%">
                <Text color="white" mb={3} fontSize="xl" fontWeight="bold">Plano Atual:</Text>

                <Flex direction="row" w="100%" p={1} borderWidth={1} mb={3} rounded={6} alignItems="center" justifyContent="space-between"
                  bg="barber.900"
                >
                  <Text color={premium ? "#fba931" : "#4dffb4"} p={2} fontSize="md" ml={1}>Plano {premium ? "Premium" : "Grátis"}</Text>

                  <Link href='/planos'>
                    <Box cursor="pointer" p={1} pl={2} pr={2} mr={3} bg="#00cd52" color="white" rounded={4}>
                      Mudar Plano
                    </Box>
                  </Link>
                </Flex>
              </Flex> */}

              <Flex direction="column" w="85%">
                <Button
                  isLoading={loader} onClick={handleUpdateUser} w="100%" mt={3} mb={4} bg="button.cta" size="lg" _hover={{ bg: '#ffb13e' }}
                >
                  Salvar
                </Button>
                <Button
                  onClick={handleLogout} w="100%" mt={3} mb={4} bg="red.600" size="lg" _hover={{ bg: 'red.500' }}
                >
                  Sair da conta
                </Button>
              </Flex>



            </Flex>

          </Flex>

        </Flex>
      </Sidebar>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try {
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/me')

    const user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      address: response.data?.address
    }

    return {
      props: {
        user,
        premium: response.data?.subscriptions?.status === "active" ? true : false
      }

    }
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: '/schedule',
        permanent: false
      }
    }
  }
})




