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
import { BarberContext } from "@/contexts/BarberContext";
import SelectTime from "@/components/timerPicker";
import { validatedAvaliableTime } from "@/utils/validatedAvaliableTime";
import moment from "moment";
import { validatedDate } from "@/utils/validatedDate";

interface HaircutsItem {
  id: string
  name: string
  price: number | string
  status: boolean
  user_id: string
  time: string
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
  const { getTimeAvaliable } = useContext(BarberContext)

  const [customer, setCustomer] = useState("")
  const [loader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Selected
  const [haircutSelected, setHaircutSelected] = useState<HaircutsItem>()
  const [barberSelected, setBarberSelected] = useState<BarbersItem>()
  const [dateSelected, setDateSelected] = useState<string>();
  // 
  const [availableTime, setAvailableTime] = useState<string[]>()
  const [initialAvailableTime, setInitialAvailableTime] = useState<string[]>()
  const [timesUsed, setTimesUsed] = useState<string[]>()
  const [timeToUsed, setTimeToUsed] = useState<string[]>()
  const [date, setDate] = useState<Date>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [, setOpenResume] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 800px)")
  const [isMobileSmall] = useMediaQuery("(max-width: 500px)")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const timeUsed = Number(haircutSelected?.time)

  async function handleRegister() {
    if (!customer) {
      toast.warning("Preencha todos os campos!")
      return
    }

    setLoader(true)
    await registerNewCut({ customer, haircut_id: haircutSelected?.id, barber_id: barberSelected?.id, time: timeToUsed[0], date: dateSelected, time_occuped: timeToUsed })
    setLoader(false)

  }

  function handleBackButton() {
    setIsLoading(true)
  }

  function handleChangeSelectHaircut(id: string) {
    const haircutItem = haircuts?.find(item => item.id === id)
    setHaircutSelected(haircutItem)
  }

  async function handleChangeSelectBarber(id: string) {
    const barber = barbers?.find(item => item.id === id)
    setBarberSelected(barber)
  }


  async function handleClickItem() {
    onOpen()
  }

  useEffect(() => {

    if (barberSelected && dateSelected) {
      getTimeAvaliable({ barber_id: barberSelected?.id, date: dateSelected }).then((value) => {
        const result = barberSelected?.available_at.filter(item => !value.includes(item));
        setAvailableTime(result)
        setTimesUsed(value)
        setInitialAvailableTime(barberSelected?.available_at)
      });
    }

  }, [barberSelected, dateSelected])

  return (
    <>
      <Head>
        <title>Novo agendamento- Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" minH="100vh" alignItems="center" justifyContent="flex-start" direction="column">

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

            <Flex w="100%" bg="barber.400" align="center" justify="center" pt={8} pb={8} direction="column" rounded={4} >

              <Heading mb={4} fontSize="2xl" ml={4} color="white" >Agendar cliente</Heading>

              <Flex direction="column" w="85%">
                <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Nome do cliente:</Text>
                <Input color="white" placeholder="Digite o nome:" w="100%" bg="gray.900" type="text" size="lg" mb={3}
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </Flex>

              {customer &&
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
              }


              {barberSelected &&
                <Flex direction="column" w="85%">
                  <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Escolha o corte:</Text>
                  <Select
                    color="white"
                    w="100%"
                    bg="gray.900"
                    size="lg"
                    mb={3}
                    onChange={(e) => handleChangeSelectHaircut(e.target.value)}
                    defaultValue=""
                  >
                    <option disabled value="">Selecione um corte</option>
                    {haircuts?.map(item => {
                      return (
                        <option style={{ background: "#1b1c29" }} key={item?.id} value={item?.id}>{item?.name}</option>
                      )
                    })}
                  </Select>
                </Flex>
              }

              {haircutSelected &&
                <Flex align='end' justify='center' w="85%" mb={3} mt={3}>
                  {!availableTime ?
                    <Button onClick={handleClickItem} w="100%" h="45px" bg='#fff' isLoading={showSpinner}>
                      {!date ? "Escolha o dia" : `Corte dia: ${dateSelected}`}
                      <ModalCalendary
                        isOpen={isOpen}
                        onClose={() => {
                          setShowSpinner(true)
                          onClose()
                        }}
                        onOpen={onOpen}
                        setDate={setDate}
                        date={date}
                        setDateSelected={setDateSelected}
                      />
                    </Button> :
                    <Flex direction='column' w='100%'>
                      <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Escolha o horário:</Text>
                      <Flex direction="row" align='center' justify='space-between' >
                        <SelectTime availableTime={validatedAvaliableTime(availableTime)} timeUsed={timeUsed} initialAvailableTime={validatedAvaliableTime(initialAvailableTime)} timesAlreadyUsed={validatedAvaliableTime(timesUsed)} setTimeToUsed={setTimeToUsed} setOpenResume={setOpenResume}/>
                        <Button onClick={handleClickItem} h="40px" w={isMobileSmall ? "30%" : (isMobile ? "50%" : "60%")} bg='white' p={1}>
                          {!date ? "Escolha o dia" : (isMobileSmall ? `Dia: ${date.getDate()}/${date.getMonth() + 1}` :
                            `Corte dia: ${date.getDate()}/${date.getMonth() + 1}`)}
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
                  }

                </Flex>
              }
              <Button
                isDisabled={!timeToUsed} isLoading={loader} onClick={handleRegister} w="85%" mb={6} bg="button.cta" size="lg" _hover={{ bg: '#ffb13e' }}
              >
                Agendar
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

