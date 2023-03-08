import { Button, Flex, Heading, Spinner, Text, useMediaQuery } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useContext, useState } from "react";
import { setupAPIClient } from "@/services/api";
import { HaircutContext } from "@/contexts/HaircutContext";
import { DiYeoman } from "react-icons/di";

export interface BarberProps {
  id: string
  barber_name: string
  hair_cuts: number
  status: boolean
  services: ServiceProps[]
}

export interface ServiceProps {
  id: string
  customer: string
  time: string
  haircut: HaircutProps
}

export interface HaircutProps {
  id: string
  name: string
  price: number
}

interface BarbersProps {
  barbers: BarberProps[]
}

export default function Barbers({ barbers }: BarbersProps) {
  const { listHaircuts } = useContext(HaircutContext)
  const [isMobile] = useMediaQuery("(max-width: 800px)")
  const [barbersList, setBarbersList] = useState<BarberProps[]>(barbers || [])
  const [loader, setLoader] = useState(false)
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [disableHaircut, setDisableHaircut] = useState("enabled")

  function handleRegisterCut() {
    setLoader(true)
  }

  // async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
  //   if (e.target.value === 'disabled') {
  //     setDisableHaircut("enabled")
  //     const refreshHaircuts = await listHaircuts(disableHaircut)
  //     setBarbersList(refreshHaircuts)
  //     return
  //   }
  //   setDisableHaircut("disabled")
  //   const refreshHaircuts = await listHaircuts(disableHaircut)
  //   setBarbersList(refreshHaircuts)
  // }

  function handleClickItem(id: string) {
    setLoadingItemId(id);
  }

  return (
    <>
      <Head>
        <title>Barbeiros - Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="flex-start" direction="column">

          <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column">

            <Flex w="100%" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mt={6} mb={4} >

              <Flex mb={isMobile ? "10px" : "0"} >
                <Heading fontSize="3xl" mr={4} color="orange.900">Barbeiros</Heading>

                <Link href="/barbers/new" onClick={handleRegisterCut}>
                  <Button color="white" bg="barber.400" _hover={{ bg: "gray.900" }} isLoading={loader}>
                    Cadastrar novo
                  </Button>
                </Link>

              </Flex>

            </Flex>


            {barbersList?.map(barber => {
              const isItemLoading = loadingItemId === barber.id;
              return (
                <Link key={barber.id} href={`/barbers/${barber.id}`} onClick={() => handleClickItem(barber.id)} >
                  <Flex cursor="pointer" w="100%" p={4} bg="barber.400" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} rounded={4} mb={4} justifyContent="space-between">
                    {isItemLoading ? <Spinner color='button.cta' speed='0.8s' size='md' /> : (
                      <>
                        <Flex direction="row" alignItems="center" justifyContent="center" mb={isMobile ? "10px" : "0"}>
                          <DiYeoman color="#fba931" size={28} />
                          <Text color="white" fontWeight="bold" ml={4} noOfLines={2}>{barber.barber_name}</Text>
                        </Flex>

                      </>
                    )}

                  </Flex>
                </Link>
              );
            })}


          </Flex>

        </Flex>
      </Sidebar >
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try {

    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/barbers',
      {
        params: {
          status: true
        }
      })

    return {
      props: {
        barbers: response.data
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







