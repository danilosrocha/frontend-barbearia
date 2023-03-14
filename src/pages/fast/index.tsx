import { Button, Center, Flex, Heading, Input, Select, Spinner, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react";
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
import { validatedAvaliableTime } from "@/utils/validatedAvaliableTime";
import { motion } from "framer-motion";
import { ModalResume } from "@/components/modalResume";

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
  haircuts: HaircutsItem[]
}

interface HaircutsProps {
  haircuts: HaircutsItem[]
  barbers: BarbersItem[]
  user: {
    id: string
  }
}

export default function FastSchedule({ barbers, haircuts, user }: HaircutsProps) {

  const { registerNewCutFast } = useContext(HaircutContext)
  const { getTimeAvaliableFast } = useContext(BarberContext)
  const [name, setName] = useState('')
  const [loader, setLoader] = useState(false)
  const [barberSelected, setBarberSelected] = useState<BarbersItem>()
  const [user_id, setUserId] = useState<string>(user?.id)
  const [availableTime, setAvailableTime] = useState<string[]>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dateSelected, setDateSelected] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [initialAvailableTime, setInitialAvailableTime] = useState<string[]>()
  const [timesUsed, setTimesUsed] = useState<string[]>()
  const [haircutSelected, setHaircutSelected] = useState<HaircutsItem>()
  const [timeToUsed, setTimeToUsed] = useState<string[]>()
  const [isMobile] = useMediaQuery("(max-width: 750px)")
  const [isMobileSmall] = useMediaQuery("(max-width: 500px)")
  const [showSpinner, setShowSpinner] = useState(false);
  const [openResume, setOpenResume] = useState(false);
  const [dataResume, setDataResume] = useState(null);

  const timeUsed = Number(haircutSelected?.time)

  async function handleRegister() {
    if (!name) {
      toast.warning("Preencha todos os campos!")
      return
    }

    setLoader(true)
    await registerNewCutFast({
      customer: name,
      haircut_id: haircutSelected?.id,
      barber_id: barberSelected?.id,
      time: timeToUsed[0],
      date: dateSelected,
      user_id,
      time_occuped: timeToUsed
    })
    setLoader(false)
    setName("")
    setTimeToUsed(null)
    setDateSelected(null)
    setAvailableTime(null)
    setShowSpinner(false)
    setBarberSelected(null)
    setHaircutSelected(null)
  }

  async function handleChangeSelectBarber(id: string) {
    const barber = barbers?.find(item => item.id === id)
    setBarberSelected(barber)
  }

  function handleClickItem() {
    onOpen()
  }

  function handleChangeSelectHaircut(id: string) {
    const haircutItem = barberSelected?.haircuts?.find(item => item.id === id)
    setHaircutSelected(haircutItem)
  }

  useEffect(() => {
    if (barberSelected && dateSelected) {
      getTimeAvaliableFast({ barber_id: barberSelected?.id, date: dateSelected }).then((value) => {
        const result = barberSelected?.available_at.filter(item => !value.includes(item));
        setAvailableTime(result)
        setTimesUsed(value)
        setInitialAvailableTime(barberSelected?.available_at)
      });
    }

    if(openResume) {
      setDataResume({
        customer: name,
        haircut: haircutSelected,
        barber: barberSelected,
        time: timeToUsed[0],
        date: dateSelected,
      })
    }
  }, [barberSelected, dateSelected, openResume])

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

            {name &&
              <Flex direction="column" w="100%">
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
              <Flex direction="column" w="100%">
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
                  {barberSelected?.haircuts.map(item => {
                    return (
                      <option style={{ background: "#1b1c29" }} key={item?.id} value={item?.id}>{item?.name}</option>
                    )
                  })}
                </Select>
              </Flex>
            }

            {haircutSelected &&
              <Flex align='end' justify='center' w="100%" mb={3} mt={3}>
                {!availableTime ?
                  <Button onClick={handleClickItem} w="100%" h="45px" bg='#fff' isLoading={showSpinner}>
                    {!date ? "Escolha o dia" : `Corte dia: ${date.getDate()}/${date.getMonth() + 1}`}
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
                      <SelectTime availableTime={validatedAvaliableTime(availableTime)} timeUsed={timeUsed} initialAvailableTime={validatedAvaliableTime(initialAvailableTime)} timesAlreadyUsed={validatedAvaliableTime(timesUsed)} setTimeToUsed={setTimeToUsed} setOpenResume={setOpenResume} />
                      <Button onClick={handleClickItem} h="40px" w={isMobileSmall ? "30%" : (isMobile ? "50%" : "60%")} bg='white' p={1} isLoading={!showSpinner}>
                        {!date ? "Escolha o dia" : (isMobileSmall ? `Dia: ${date.getDate()}/${date.getMonth() + 1}` :
                          `Corte dia: ${date.getDate()}/${date.getMonth() + 1}`)}
                        {!openResume &&
                          <ModalCalendary
                            isOpen={isOpen}
                            onClose={onClose}
                            onOpen={onOpen}
                            setDate={setDate}
                            date={date}
                            setDateSelected={setDateSelected}
                          />}
                      </Button>
                    </Flex>
                  </Flex>
                }
              </Flex>
            }

            {openResume &&
              <ModalResume
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                openResume={openResume}
                data={dataResume}
                setOpenResume={setOpenResume}
              />
            }

            <Button
              background="button.cta"
              mb={6}
              color="gray.900"
              h="45px"
              size="lg"
              _hover={{ bg: "#ffb13e" }}
              isLoading={loader}
              isDisabled={!timeToUsed}
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
    const user_name = await setConfigUserFromEnv()

    const apiClient = setupAPIClient(ctx)

    const user = await apiClient.get('/user/check',
      {
        params: {
          name: user_name
        }
      })

    const response = await apiClient.get('/haircuts/barber',
      {
        params: {
          user_id: user?.data?.id,
          status: true
        }
      })

    const barbers = await apiClient.get('/barbers/fast',
      {
        params: {
          status: true,
          user_id: user?.data?.id,
        }
      })

    return {
      props: {
        haircuts: response.data,
        barbers: barbers.data,
        user: user.data
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