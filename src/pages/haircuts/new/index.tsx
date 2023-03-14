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
import { validatedValueHaircut } from "@/utils/validatedValueHaircut";
import { parseOneTimeString } from "@/utils/validatedTime";

interface BarbersItem {
  id: string
  barber_name: string
  hair_cuts: number
  status: boolean
  available_at?: string[]
}
interface NewHaircutProps {
  subscriptions: string,
  count: number,
  barbers: BarbersItem[]
}

export default function NewHaircut({ subscriptions, count, barbers }: NewHaircutProps) {
  const { registerHaircut } = useContext(HaircutContext)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [time, setTime] = useState("")
  const [loader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [barberSelected, setBarberSelected] = useState<BarbersItem>()
  const [isMobile] = useMediaQuery("(max-width: 800px)")

  async function handleRegisterHaircut() {
    if (!name || !price) {
      toast.warning("Preencha todos os campos!")
      return
    }

    const newPrice = (validatedValueHaircut(price))
    const newTime = (parseOneTimeString(time))

    setLoader(true)
    await registerHaircut({ name, price: newPrice, time: newTime, barber_id: barberSelected?.id})
    setLoader(false)
  }

  async function handleChangeSelectBarber(id: string) {
    const barber = barbers?.find(item => item.id === id)
    setBarberSelected(barber)
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
        <Flex background="barber.900" minH="100vh" alignItems="center" justifyContent="flex-start" direction="column">

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

              <Heading mb={4} fontSize="2xl" ml={4} color="white" >Cadastrar modelo de corte</Heading>
              <Flex direction="column" w="85%">
                <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Escolha o barbeiro:</Text>
                <Select
                  color="white"
                  w="100%"
                  bg="gray.900"
                  size="lg"
                  mb={3}
                  onChange={(e) => handleChangeSelectBarber(e.target.value)}
                  defaultValue=""
                >
                  <option disabled value="">Selecione um barbeiro</option>
                  {barbers?.map(item => {
                    return (
                      <option style={{ background: "#1b1c29" }} key={item?.id} value={item?.id}>{item?.barber_name}</option>
                    )
                  })}
                </Select>

              </Flex>

              {barberSelected &&
                <Flex direction="column" w="85%">
                  <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Digite o nome do corte:</Text>
                  <Input color="white" placeholder="Nome do corte" w="100%" bg="gray.900" type="text" size="lg" mb={3}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Flex>
              }

              {name &&
                <Flex direction="column" w="85%">
                  <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Digite o preço do corte:</Text>
                  <Input color="white" placeholder="Valor do corte ex: 59.90" w="100%" bg="gray.900" type="text" size="lg" mb={4}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Flex>
              }

              {price &&
                <Flex direction="column" w="85%">
                  <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Digite o tempo do corte:</Text>
                  <Input color="white" placeholder="Tempo do corte ex: 30" w="100%" bg="gray.900" type="text" size="lg" mb={4}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Flex>
              }

              <Button
                isLoading={loader} onClick={handleRegisterHaircut} w="85%" mb={6} bg="button.cta" size="lg" _hover={{ bg: '#ffb13e' }} isDisabled={!time}
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

    const barbers = await apiClient.get('/barbers',
      {
        params: {
          status: true
        }
      })

    return {
      props: {
        subscriptions: response.data?.subscriptions?.status === 'active' ? true : false,
        count: count.data,
        barbers: barbers.data
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

