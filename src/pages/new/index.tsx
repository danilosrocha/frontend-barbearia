import { Button, Flex, Heading, Input, useMediaQuery, Text, Select, useDisclosure } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi'
import { useContext, useEffect, useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { HaircutContext } from "@/contexts/HaircutContext";
import { toast } from "react-toastify";
import { ModalCalendary } from "@/components/modalCalendary";
import moment from 'moment';

interface HaircutsItem {
  id: string
  name: string
  price: number | string
  status: boolean
  user_id: string
}
interface BarbersItem {
  id: string
  barber_name: string
  hair_cuts: number
  status: boolean
  available_at?: string[]
}


interface HaircutsProps {
  haircuts: HaircutsItem[]
  barbers: BarbersItem[]
}

export default function New({ haircuts, barbers }: HaircutsProps) {
  const { registerNewCut } = useContext(HaircutContext)
  const currentDay = `${moment().date()}/${moment().month() + 1}`
  const [customer, setCustomer] = useState("")
  const [haircutSelected, setHaircutSelected] = useState(haircuts[0])
  const [loader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [barberSelected, setBarberSelected] = useState(barbers[0])
  const [timeSelected, setTimeSelected] = useState("07:00")
  const [date, setDate] = useState<Date>();
  const [dateSelected, setDateSelected] = useState<string>(currentDay);
  const [barber, setBarber] = useState<BarbersItem>()
  const [isMobile] = useMediaQuery("(max-width: 800px)")
  const { isOpen, onOpen, onClose } = useDisclosure()

  async function barberAvaliableTime() {
    const apiClient = setupAPIClient()
    const response = await apiClient.get('/barber',
      {
        params: {
          barber_id: barberSelected[0]
        }
      })

    setBarber(response.data)
  }

  async function handleRegister() {
    if (!customer) {
      toast.warning("Preencha todos os campos!")
      return
    }

    setLoader(true)
    await registerNewCut({ customer, haircut_id: haircutSelected?.id, barber_id: barberSelected?.id, time: timeSelected, date: dateSelected })
    setLoader(false)
  }

  function handleBackButton() {
    setIsLoading(true)
  }

  function handleChangeSelect(id: string) {
    const haircutItem = haircuts?.find(item => item.id === id)
    setHaircutSelected(haircutItem)
  }

  function handleChangeSelectBarber(id: string) {
    const barber = barbers?.find(item => item.id === id)
    setBarberSelected(barber)
  }

  function handleChangeSelectTime(id: string) {
    const time = barberSelected?.available_at?.find(item => item === id)
    setTimeSelected(time)
  }

  function handleClickItem() {
    onOpen()
  }

  useEffect(() => {
    barberAvaliableTime()

  }, [barberSelected])

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

              <Flex direction="column" w="85%">
                <Text color="white" mb={3} fontSize="xl" fontWeight="bold">Nome do cliente:</Text>
                <Input color="white" placeholder="Digite o nome:" w="100%" bg="gray.900" type="text" size="lg" mb={3}
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </Flex>

              <Flex direction="column" w="85%">
                <Text color="white" mb={3} fontSize="xl" fontWeight="bold">Selecione o corte:</Text>
                <Select color="white" w="100%" bg="gray.900" size="lg" mb={3} onChange={(e) => handleChangeSelect(e.target.value)}>
                  {haircuts?.map(item => (
                    <option style={{ background: "#1b1c29" }} key={item?.id} value={item?.id}>{item?.name}</option>
                  ))}
                </Select>
              </Flex>

              <Flex direction="column" w="85%">
                <Text color="white" mb={3} fontSize="xl" fontWeight="bold">Selecione o barbeiro:</Text>
                <Select color="white" w="100%" bg="gray.900" size="lg" mb={3} onChange={(e) => handleChangeSelectBarber(e.target.value)}>
                  {barbers?.map(item => {
                    return (
                      <option style={{ background: "#1b1c29" }} key={item?.id} value={item?.id}>{item?.barber_name}</option>
                    )
                  })}
                </Select>
              </Flex>

              <Flex direction="column" w="85%" mb={6} justify="space-between" >
                <Text color="white" mb={3} fontSize="xl" fontWeight="bold">Selecione o horário:</Text>
                <Flex direction={isMobile ? "column" : "row"} w="100%" align="center">
                  <Select color="white" w="100%" bg="gray.900" size="lg" mr={isMobile ? 0 : 3} mb={isMobile ? 4 : 0} onChange={(e) => handleChangeSelectTime(e.target.value)}>
                    {barberSelected && barberSelected?.available_at?.map(item => (
                      <option style={{ background: "#1b1c29" }} key={item} value={item}>{item}</option>
                    ))}
                  </Select>


                  <Button onClick={handleClickItem} w={isMobile ? "100%" : "50%"}>
                    {!date ? "Escolha o dia" : `Corte dia: ${date?.getDate()}/${date?.getMonth() + 1}`}
                    <ModalCalendary
                      isOpen={isOpen}
                      onClose={onClose}
                      onOpen={onOpen}
                      setDate={setDate}
                      date={date}
                      setDateSelected={setDateSelected}
                    />
                  </Button>
                </Flex>

              </Flex>

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

    const barbers = await apiClient.get('/barbers',
      {
        params: {
          status: true
        }
      })

    return {
      props: {
        haircuts: response.data,
        barbers: barbers.data
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

