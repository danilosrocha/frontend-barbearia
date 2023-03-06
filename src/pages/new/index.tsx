import { Button, Flex, Heading, Input, useMediaQuery, Text, Select } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi'
import { useContext, useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { HaircutContext } from "@/contexts/HaircutContext";
import { toast } from "react-toastify";

interface HaircutsItem {
  id: string
  name: string
  price: number | string
  status: boolean
  user_id: string
}

interface HaircutsProps {
  haircuts: HaircutsItem[]
}

export default function New({ haircuts }: HaircutsProps) {
  const { registerNewCut } = useContext(HaircutContext)
  const [customer, setCustomer] = useState("")
  const [haircutSelected, setHaircutSelected] = useState(haircuts[0])
  const [loader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile] = useMediaQuery("(max-width: 800px)")

  async function handleRegister() {
    if (!customer) {
      toast.warning("Preencha todos os campos!")
      return
    }
    setLoader(true)
    await registerNewCut({ customer, haircut_id: haircutSelected?.id })
    setLoader(false)
  }

  function handleBackButton() {
    setIsLoading(true)
  }

  function handleChangeSelect(id: string) {
    const haircutItem = haircuts?.find(item => item.id === id)
    setHaircutSelected(haircutItem)
  }

  return (
    <>
      <Head>
        <title>Novo agendamento- Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="flex-start" direction="column">

          <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column" >

            <Flex w="100%" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mt={6} mb={4} >

              <Flex mb={isMobile ? "10px" : "0"} >

                <Link href="/schedule" onClick={handleBackButton}>
                  <Button
                    isLoading={isLoading} color="white" bg="barber.400" _hover={{ bg: "gray.900" }} display="flex" alignItems="center" justifyContent="center"
                  >
                    <FiChevronLeft size={24} color="#fff" />
                    Voltar
                  </Button>
                </Link>

                <Heading fontSize="3xl" ml={4} color="orange.900">Novo corte</Heading>

              </Flex>

            </Flex>

            <Flex w="100%" bg="barber.400" align="center" justify="center" pt={8} pb={8} direction="column" rounded={4}>

              <Heading mb={4} fontSize="2xl" ml={4} color="white" >Agendar cliente</Heading>

              <Input color="white" placeholder="Nome do cliente" w="85%" bg="gray.900" type="text" size="lg" mb={3}
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />

              <Select color="white" w="85%" bg="gray.900" size="lg" mb={3} onChange={(e) => handleChangeSelect(e.target.value)}>
                {haircuts?.map(item => (
                  <option style={{ background: "#1b1c29" }} key={item?.id} value={item?.id}>{item?.name}</option>
                ))}

              </Select>

              <Button
                isLoading={loader} onClick={handleRegister} w="85%" mb={6} bg="button.cta" size="lg" _hover={{ bg: '#ffb13e' }}
              >
                Cadastrar
              </Button>

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
    const response = await apiClient.get('/haircuts',
      {
        params: {
          status: true
        }
      })

    if (response.data === null) {
      toast.warning("Nenhum corte de cabelo cadastrado!")
    }

    return {
      props: {
        haircuts: response.data
      }

    }
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/schedule',
        permanent: false
      }
    }

  }
})

