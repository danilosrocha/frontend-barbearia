import { Button, Flex, Heading, Spinner, Stack, Switch, Text, useMediaQuery, Link as ChackLink, Box } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { IoMdPricetag } from 'react-icons/io'
import { AiOutlinePlus, AiOutlineLine } from "react-icons/ai";
import { canSSRAuth } from "@/utils/canSSRAuth";
import React, { useState } from "react";
import { setupAPIClient } from "@/services/api";

interface HaircutsBarber {
  haircuts: BarberHaircuts[]
}
interface BarberHaircuts {
  barber_name: string
  id: string
  haircuts: Haircut[]
}
interface Haircut {
  id: string
  name: string
  price: number
  status: boolean
  time: string
  user_id: string
  barber_id: string
}

export default function Haircuts({ haircuts }: HaircutsBarber) {
  const [isMobile] = useMediaQuery("(max-width: 800px)")
  const [loader, setLoader] = useState(false)
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [showHaircuts, setShowHaircuts] = useState({});

  function handleRegisterCut() {
    setLoader(true)
  }

  function handleClickItem(haircutId) {
    setLoadingItemId(haircutId);
  }

  const handleShowHaircuts = (barberName: string) => {
    setShowHaircuts({
      ...showHaircuts,
      [barberName]: !showHaircuts[barberName],
    });

  };

  return (
    <>
      <Head>
        <title>Modelos de cortes - Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" minH="100vh" alignItems="center" justifyContent="flex-start" direction="column">

          <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column">

            <Flex w="100%" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mt={6} mb={4} >

              <Flex mb={isMobile ? "10px" : "0"} direction={isMobile ? "column" : "row"}>
                <Heading fontSize="3xl" mr={4} color="orange.900">Modelos de corte</Heading>

                <Link href="/haircuts/new" onClick={handleRegisterCut}>
                  <Button color="white" bg="barber.400" _hover={{ bg: "gray.900" }} isLoading={loader}>
                    Cadastrar novo
                  </Button>
                </Link>

              </Flex>
            </Flex>

            {haircuts && haircuts.map(barber => {
              return (
                <Box key={barber?.barber_name} >
                  <Flex align='center' mb={4} gap={3} w="100%" p={3} bg="barber.400" justify='space-between'>
                    <Heading fontSize="xl" color="white" ml={2} fontWeight="bold">Barbeiro: {barber?.barber_name}</Heading>
                    <Button bg='transparent' _hover={{ bg: '#1B1C29' }} onClick={() => handleShowHaircuts(barber.barber_name)}>
                      {showHaircuts[barber.barber_name] ? <AiOutlineLine color="#fff" size={20} /> : <AiOutlinePlus color="#fff" size={20} />}

                    </Button>
                  </Flex>
                  {showHaircuts[barber.barber_name] && barber?.haircuts?.map(haircut => {
                    const priceFormat = parseFloat(String(haircut?.price)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    const isItemLoading = loadingItemId === haircut.id;
                    if (haircut.status) {
                      return (
                        <Link key={haircut.id} href={`/haircuts/${haircut.id}`} onClick={() => handleClickItem(haircut.id)} >
                          <Flex cursor="pointer" w="100%" p={4} bg="barber.400" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} rounded={4} mb={4} justifyContent="space-between">
                            {isItemLoading ? <Spinner color='button.cta' speed='0.8s' size='md' /> : (
                              <>
                                <Flex direction="row" alignItems="center" justifyContent="center" mb={isMobile ? "10px" : "0"}>
                                  <IoMdPricetag color="#fba931" size={28} />
                                  <Text color="white" fontWeight="bold" ml={4} noOfLines={2}>{haircut?.name} - </Text>
                                  <Text color="white" fontWeight="bold" ml={1}>{(haircut?.time)} min</Text>
                                </Flex>
                                <Text color="white" fontWeight="bold">Preço: {priceFormat}</Text>
                              </>
                            )}
                          </Flex>
                        </Link>
                      );
                    }
                    return null
                  })}
                </Box>
              )
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
    const response = await apiClient.get('/haircuts/barber',
      {
        params: {
          status: true
        }
      })

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







