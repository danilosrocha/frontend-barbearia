import { Button, Center, Flex, Heading, Input, Select, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import logoImg from '../../../public/images/logo.svg'
import { setupAPIClient } from "@/services/api";
import { ModalCalendary } from "@/components/modalCalendary";
import { HaircutContext } from "@/contexts/HaircutContext";
import { BarberContext } from "@/contexts/BarberContext";
import { canSSRGuestFast } from "@/utils/canSSRGuestFast";
import { setConfigUserFromEnv } from "@/utils/isClient";
import SelectTime from "@/components/timerPicker";

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

export default function FastSchedule({ barbers, haircuts }: HaircutsProps) {

  const { registerNewCutFast } = useContext(HaircutContext)
  const { getTimeAvaliableFast } = useContext(BarberContext)
  const [name, setName] = useState('')
  const [loader, setLoader] = useState(false)
  const [barberSelected, setBarberSelected] = useState(barbers[0])
  const [timeSelected, setTimeSelected] = useState<string>()
  const [user_id, setUserId] = useState<string>()
  const [availableTime, setAvailableTime] = useState<string[]>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dateSelected, setDateSelected] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [isMobile] = useMediaQuery("(max-width: 750px)")

  async function handleIdUserBarber() {

    const apiClient = setupAPIClient()
    const response = await apiClient.get('/user/check',
      {
        params: {
          nameBarber: setConfigUserFromEnv()
        }
      })
    setUserId(response.data?.id)
  }

  async function handleRegister() {
    if (!name) {
      toast.warning("Preencha todos os campos!")
      return
    }

    setLoader(true)
    await registerNewCutFast({
      customer: name,
      haircut_id: haircuts[0]?.id,
      barber_id: barberSelected?.id,
      time: timeSelected,
      date: dateSelected,
      user_id
    })
    setLoader(false)
    setName("")
  }

  async function handleChangeSelectBarber(id: string) {
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
    handleIdUserBarber()
    if (barberSelected && dateSelected) {
      getTimeAvaliableFast({ barber_id: barberSelected?.id, date: dateSelected }).then((value) => {
        const result = barberSelected?.available_at.filter(item => !value?.services?.times.includes(item));
        setAvailableTime(result)
        if (!timeSelected) {
          setTimeSelected(result[0])
        }
      });
    }

  }, [barberSelected, dateSelected])

  return (
    <>
      <Head>
        <title>Agende seu corte - Rocha's client</title>
      </Head>
      <Flex direction={isMobile ? "column" : "row"} background="barber.900" minH="100vh" align="center" justify='center'>

        <Flex align="center" justify='center' w='100%' p={isMobile ? 5 : 10} direction={isMobile ? "column" : "row"}>

          <Flex direction="column" align='center' justify='center' w="100%">
            <Heading fontSize={isMobile ? "3xl" : "5xl"} color="#EF871D" fontWeight="bold" textAlign='center' mb={isMobile ? 5 : 10}>Agendamento rápido
            </Heading>
            <Center mb={isMobile ? 5 : 10}>
              <Image
                src={logoImg}
                quality={100}
                width={isMobile ? 150 : 450}
                objectFit="fill"
                alt="Logo Rocha's Client"
              />
            </Center>
          </Flex>

          <Flex
            borderLeft={isMobile ? "0px solid #fff" : "5px solid #fff"}
            borderTop={isMobile ? "4px solid #fff" : "0px solid #fff"}
            direction="column"
            w="100%" ml={isMobile ? 0 : 10} p={isMobile ? 0 : 10} >

            <Flex direction="column" w="100%">
              <Text color="white" mb={1} mt={isMobile ? 5 : 0} fontSize="xl" fontWeight="bold">Informe seu nome:</Text>
              <Input
                background="#171922"
                _hover={{ bg: "#1b1c29" }}
                color="white"
                variant="filled"
                size="lg"
                placeholder="Digite seu nome:"
                type="text"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Flex>

            <Flex direction="column" w="100%">
              <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Escolha o barbeiro:</Text>
              <Select color="white" w="100%" bg="gray.900" size="lg" mb={4} onChange={(e) => handleChangeSelectBarber(e.target.value)}>
                {barbers?.map(item => {
                  return (
                    <option style={{ background: "#1b1c29" }} key={item?.id} value={item?.id}>{item?.barber_name}</option>
                  )
                })}
              </Select>
            </Flex>

            <Flex align='end' justify='center'  mb={3} mt={3}>
              {!availableTime ?
                <Button onClick={handleClickItem} w="100%" h="45px">
                  {!date ? "Escolha o dia" : `Corte dia: ${date?.getDate()}/${date?.getMonth() + 1}`}
                  <ModalCalendary
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpen={onOpen}
                    setDate={setDate}
                    date={date}
                    setDateSelected={setDateSelected}
                  />
                </Button> :
                <Flex direction='column' w='100%' >
                  <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Escolha o horário:</Text>
                  <Flex direction="row" align='center' justify='space-between' >
                    <SelectTime availableTime={availableTime} />
                    <Button onClick={handleClickItem} h="40px" w={isMobile ? "50%" : "60%"} p={1}>
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
              }


            </Flex>

            <Button
              background="button.cta"
              mb={6}
              color="gray.900"
              h="45px"
              size="lg"
              _hover={{ bg: "#ffb13e" }}
              isLoading={loader}
              isDisabled={!timeSelected}
              onClick={handleRegister}
            >
              Agendar
            </Button>
          </Flex>

        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = canSSRGuestFast(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/haircuts/fast',
      {
        params: {
          status: true
        }
      })

    const barbers = await apiClient.get('/barbers/fast',
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
        destination: '/',
        permanent: false
      }
    }
  }
})