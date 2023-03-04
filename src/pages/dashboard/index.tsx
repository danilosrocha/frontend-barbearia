import { Button, Flex, Heading, Spinner, useDisclosure, Switch, Text, useMediaQuery, Link as ChackLink } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { IoMdPerson } from 'react-icons/io'
import { canSSRAuth } from "@/utils/canSSRAuth";
import { ChangeEvent, useContext, useState } from "react";
import { setupAPIClient } from "@/services/api";
import { HaircutContext } from "@/contexts/HaircutContext";
import { ModalInfo } from "@/components/modal";

export interface ScheduleItem {
  id: string
  customer: string
  haircut: {
    id: string
    name: string
    price: number | string
    status: boolean
    user_id: string
  }
}

interface DashBoardProps {
  schedule: ScheduleItem[]
}

export default function Dashboard({ schedule }: DashBoardProps) {
  const { finishCut } = useContext(HaircutContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [list, setList] = useState(schedule)
  const [service, setService] = useState<ScheduleItem>()
  const [loader, setLoader] = useState(false)
  const [loadingFinish, setLoadingFinish] = useState(false)
  const [isMobile] = useMediaQuery("(max-width: 800px)")

  function handleRegisterCut() {
    setLoader(true)
  }

  function handleClickItem(item: ScheduleItem) {
    setService(item)
    onOpen()
  }

  async function handleFinish(id: string) {
    setLoadingFinish(true)
    await finishCut(id)

    const filterItem = list?.filter(item => {
      return (item?.id !== id)
    })
    setList(filterItem)
    onClose()
    setLoadingFinish(false)
  }

  return (
    <>
      <Head>
        <title>Modelos de cortes - Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="flex-start" direction="column">

          <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column">

            <Flex w="100%" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mt={6} mb={4} >

              <Flex mb={isMobile ? "10px" : "0"} >
                <Heading fontSize="3xl" mr={4} color="orange.900">Agenda</Heading>

                <Link href="/new" onClick={handleRegisterCut}>
                  <Button color="white" bg="barber.400" _hover={{ bg: "gray.900" }} isLoading={loader}>
                    Registrar
                  </Button>
                </Link>

              </Flex>

            </Flex>

            {list?.map(item => {

              return (
                <ChackLink key={item?.id} onClick={() => handleClickItem(item)} >
                  <Flex cursor="pointer" w="100%" p={4} bg="barber.400" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} rounded={4} mb={4} justifyContent="space-between">

                    <Flex direction="row" align="center" justify="center" mb={isMobile ? "10px" : "0"}>
                      <IoMdPerson color="#fba931" size={28} />
                      <Text color="white" fontWeight="bold" ml={4} noOfLines={2}>{item?.customer}</Text>
                    </Flex>
                    <Text color="white" fontWeight="bold">{item?.haircut?.name}</Text>
                    <Text color="white" fontWeight="bold">R$ {Number(item?.haircut?.price).toFixed(2)}</Text>

                  </Flex>
                </ChackLink>
              );
            })}


          </Flex>

        </Flex>
      </Sidebar >
      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={() => handleFinish(service?.id)}
        loadingFinish={loadingFinish}
      />
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try {

    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/schedules')

    return {
      props: {
        schedule: response.data
      }

    }
  } catch (error) {
    console.log(error);
    return {
      props: {
        schedule: []
      }
    }

  }
})







