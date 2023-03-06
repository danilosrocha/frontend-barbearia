import { Button, Flex, Heading, Input, useMediaQuery, Text } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi'
import { useContext, useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { HaircutContext } from "@/contexts/HaircutContext";
import { toast } from "react-toastify";
import { validatedValueHaircut } from "@/utils/validatedValueHaircut";

interface NewHaircutProps {
  subscriptions: string,
  count: number
}

export default function NewHaircut({ subscriptions, count }: NewHaircutProps) {
  const { registerHaircut } = useContext(HaircutContext)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [loader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile] = useMediaQuery("(max-width: 800px)")

  async function handleRegisterHaircut() {
    if (!name || !price) {
      toast.warning("Preencha todos os campos!")
      return
    }

    const newPrice = (validatedValueHaircut(price))

    setLoader(true)
    await registerHaircut({ name, price: newPrice })
    setLoader(false)
  }

  function handleBackButton() {
    setIsLoading(true)
  }

  return (
    <>
      <Head>
        <title>Modelos de cortes - Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="flex-start" direction="column">

          <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column" >

            <Flex w="100%" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mt={6} mb={4} >

              <Flex mb={isMobile ? "10px" : "0"} >

                <Link href="/haircuts" onClick={handleBackButton}>
                  <Button
                    isLoading={isLoading} color="white" bg="barber.400" _hover={{ bg: "gray.900" }} display="flex" alignItems="center" justifyContent="center"
                  >
                    <FiChevronLeft size={24} color="#fff" />
                    Voltar
                  </Button>
                </Link>

                <Heading fontSize="3xl" ml={4} color="orange.900">Modelos de corte</Heading>

              </Flex>

            </Flex>

            <Flex w="100%" bg="barber.400" align="center" justify="center" pt={8} pb={8} direction="column" rounded={4}>

              <Heading mb={4} fontSize="2xl" ml={4} color="white" >Cadastrar modelo</Heading>

              <Input color="white" placeholder="Nome do corte" w="85%" bg="gray.900" type="text" size="lg" mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input color="white" placeholder="Valor do corte ex: 59.90" w="85%" bg="gray.900" type="text" size="lg" mb={4}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <Button
                isLoading={loader} onClick={handleRegisterHaircut} w="85%" mb={6} bg="button.cta" size="lg" _hover={{ bg: '#ffb13e' }} isDisabled={!subscriptions && count >= 3}
              >
                Cadastrar
              </Button>

              {!subscriptions && count >= 3 && (
                <Flex direction="row" align="center" justifyContent="center">
                  <Text
                    color="white"
                  >
                    Você atingiu seu limite de cortes.
                  </Text>
                  <Link href="/planos">
                    <Text ml={1} fontWeight="bold" color="#31fb6A" cursor="pointer">
                      Seja premium
                    </Text>
                  </Link>
                </Flex>
              )}

            </Flex>

          </Flex>

        </Flex>
      </Sidebar >
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/check')
    const count = await apiClient.get('/haircuts/count')

    return {
      props: {
        subscriptions: response.data?.subscriptions?.status === 'active' ? true : false,
        count: count.data
      }
    }

  } catch (error) {
    return {
      redirect: {
        destination: '/schedule',
        permanent: false
      }
    }
  }
})

