import { Button, Flex, Heading, Spinner, Stack, Switch, Text, useMediaQuery } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { IoMdPricetag } from 'react-icons/io'
import { canSSRAuth } from "@/utils/canSSRAuth";
import { ChangeEvent, useContext, useState } from "react";
import { setupAPIClient } from "@/services/api";
import { HaircutContext } from "@/contexts/HaircutContext";

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

export default function Haircuts({ haircuts }: HaircutsProps) {
  const { listHaircuts } = useContext(HaircutContext)
  const [isMobile] = useMediaQuery("(max-width: 800px)")
  const [haircutList, setHaircutList] = useState<HaircutsItem[]>(haircuts || [])
  const [loader, setLoader] = useState(false)
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [disableHaircut, setDisableHaircut] = useState("enabled")

  function handleRegisterCut() {
    setLoader(true)
  }

  async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value === 'disabled') {
      setDisableHaircut("enabled")
      const refreshHaircuts = await listHaircuts(disableHaircut)
      setHaircutList(refreshHaircuts)
      return
    }
    setDisableHaircut("disabled")
    const refreshHaircuts = await listHaircuts(disableHaircut)
    setHaircutList(refreshHaircuts)
  }

  function handleClickItem(haircutId) {
    setLoadingItemId(haircutId);
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
                <Heading fontSize="3xl" mr={4} color="orange.900">Modelos de corte</Heading>

                <Link href="/haircuts/new" onClick={handleRegisterCut}>
                  <Button color="white" bg="barber.400" _hover={{ bg: "gray.900" }} isLoading={loader}>
                    Cadastrar novo
                  </Button>
                </Link>

              </Flex>

              <Stack alignItems="center" direction="row">
                <Text fontSize="2xs" fontWeight="bold" color="white">{disableHaircut === 'disabled' ? "DESATIVADOS" : "ATIVADOS"}</Text>
                <Switch colorScheme="green" size="lg" isChecked={disableHaircut === 'disabled' ? false : true} value={disableHaircut} onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisable(e)} />
              </Stack>
            </Flex>


            {haircutList?.map(haircut => {
              const priceFormat = Number(haircut.price).toFixed(2)
              const isItemLoading = loadingItemId === haircut.id;
              return (
                <Link key={haircut.id} href={`/haircuts/${haircut.id}`} onClick={() => handleClickItem(haircut.id)} >
                  <Flex cursor="pointer" w="100%" p={4} bg="barber.400" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} rounded={4} mb={4} justifyContent="space-between">
                    {isItemLoading ? <Spinner color='button.cta' speed='0.8s' size='md' /> : (
                      <>
                        <Flex direction="row" alignItems="center" justifyContent="center" mb={isMobile ? "10px" : "0"}>
                          <IoMdPricetag color="#fba931" size={28} />
                          <Text color="white" fontWeight="bold" ml={4} noOfLines={2}>{haircut.name}</Text>
                        </Flex>
                        <Text color="white" fontWeight="bold">Preço: R$ {priceFormat}</Text>
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
    const response = await apiClient.get('/haircuts',
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







