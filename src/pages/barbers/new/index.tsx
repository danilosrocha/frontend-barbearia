import { Button, Flex, Heading, Input, Text, useMediaQuery } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi'
import { useContext, useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { toast } from "react-toastify";
import { BarberContext } from "@/contexts/BarberContext";
import { parseTimeString } from "@/utils/validatedTime";

export default function NewBarber() {
  const { registerBarber } = useContext(BarberContext)
  const [name, setName] = useState("")
  const [startWork, setStartWork] = useState("07:00")
  const [endWork, setEndWork] = useState("20:00")
  const [workTime, setWorkTime] = useState("10")
  const [loader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile] = useMediaQuery("(max-width: 800px)")

  async function handleRegisterBarber() {
    if (!name) {
      toast.warning("Preencha todos os campos!")
      return
    }
    setLoader(true)
    const response = await handleValidatedTime()
    await registerBarber({ barber_name: name, available_at: response })
    setLoader(false)
  }

  function handleBackButton() {
    setIsLoading(true)
  }

  async function handleValidatedTime() {
    return parseTimeString(startWork, endWork, Number(workTime))
  }

  return (
    <>
      <Head>
        <title>Cadastrar barbeiro - Rocha's Client Barber</title>
      </Head>
      <Sidebar>
        <Flex background="barber.900" minH="100vh" alignItems="center" justifyContent="flex-start" direction="column">

          <Flex pt={8} pb={8} maxW="1200px" w="100%" direction="column" >

            <Flex w="100%" direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mt={6} mb={4} >

              <Flex mb={isMobile ? "10px" : "0"} >

                <Link href="/barbers" onClick={handleBackButton}>
                  <Button
                    isLoading={isLoading} color="white" bg="barber.400" _hover={{ bg: "gray.900" }} display="flex" alignItems="center" justifyContent="center"
                  >
                    <FiChevronLeft size={24} color="#fff" />
                    Voltar
                  </Button>
                </Link>

                <Heading fontSize="3xl" ml={4} color="orange.900">Barbeiro</Heading>

              </Flex>

            </Flex>

            <Flex w="100%" bg="barber.400" align="center" justify="center" pt={8} pb={8} direction="column" rounded={4}>

              <Heading mb={4} fontSize="2xl" ml={4} color="white" >Cadastrar barbeiro</Heading>

              <Flex direction="column" w="85%">
                <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Nome do barbeiro:</Text>
                <Input color="white" placeholder="Digite o nome:" w="100%" bg="gray.900" type="text" size="lg" mb={3}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Flex>

              <Flex justify="space-between" w="85%" gap={4} direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} mb={3}>

                <Flex direction="column" w="100%">
                  <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Horário de entrada</Text>
                  <Input color="white" placeholder="Exemplo: 7:00" w="100%" bg="gray.900" type="text" size="lg" mb={3}
                    value={startWork}
                    onChange={(e) => setStartWork(e.target.value)}
                  />

                  <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Horário de saída</Text>
                  <Input color="white" placeholder="Exemplo: 20:00" w="100%" bg="gray.900" type="text" size="lg"
                    value={endWork}
                    onChange={(e) => setEndWork(e.target.value)}
                  />
                </Flex>

              </Flex>

              <Button
                isLoading={loader} onClick={handleRegisterBarber} w="85%" mb={6} mt={3} bg="button.cta" size="lg" _hover={{ bg: '#ffb13e' }}
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

  return {
    props: {}
  }

})

