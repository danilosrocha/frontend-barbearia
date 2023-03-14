import { Button, Flex, Heading, Input, useMediaQuery, Text, Stack, Switch } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";
import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi'
import { ChangeEvent, useContext, useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { HaircutContext } from "@/contexts/HaircutContext";
import { toast } from "react-toastify";
import { validatedValueHaircut } from "@/utils/validatedValueHaircut";
import { parseOneTimeString } from "@/utils/validatedTime";

export interface DetailProps {
    id: string
    name: string
    price: number | string
    status: boolean
    user_id: string
    time: string
}

interface HaircutProps {
    haircutDetail: DetailProps
    subscriptions: string | null
}

export default function EditHaircut({ haircutDetail, subscriptions }: HaircutProps) {
    const { updateHaircut } = useContext(HaircutContext)
    const [name, setName] = useState(haircutDetail?.name || "")
    const [price, setPrice] = useState(haircutDetail?.price || "")
    const [haircut_id, setHaircut_id] = useState(haircutDetail?.id || "")
    const [time, setTime] = useState(haircutDetail?.time || "")
    const [loader, setLoader] = useState(false)
    const [isMobile] = useMediaQuery("(max-width: 800px)")
    const [isLoading, setIsLoading] = useState(false)
    const [disableHaircut, setDisableHaircut] = useState(haircutDetail?.status === true ? "enabled" : "disabled")
    const precoFormatado = parseFloat(String(price)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    async function handleUpdateHaircut() {
        if (!name || !price) {
            toast.warning("Preencha todos os campos!")
            return
        }

        const newPrice = (validatedValueHaircut(price))
        const newTime = (parseOneTimeString(time))

        setLoader(true)
        await updateHaircut({ name, haircut_id, status: disableHaircut, price: newPrice, time: newTime })
        setLoader(false)
    }

    function handleDisable(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value === "disabled") {
            setDisableHaircut("enabled")
            return
        }
        setDisableHaircut("disabled")
    }

    function handleBackButton() {
        setIsLoading(true);
    }

    return (
        <>
            <Head>
                <title>Editar corte - Rocha's Client Barber</title>
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

                            <Heading mb={4} fontSize="2xl" ml={4} color="white" >Editar corte</Heading>

                            <Flex direction="column" w="85%">
                                <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Nome do corte:</Text>
                                <Input color="white" placeholder={name} w="100%" bg="gray.900" type="text" size="lg" mb={3}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Flex>

                            <Flex direction="column" w="85%">
                                <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Valor do corte:</Text>
                                <Input color="white" placeholder={precoFormatado} w="100%" bg="gray.900" type="text" size="lg" mb={3}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Flex>

                            <Flex direction="column" w="85%">
                                <Text color="white" mb={1} fontSize="xl" fontWeight="bold">Tempo do corte:</Text>
                                <Input color="white" placeholder={`${time} min`} w="100%" bg="gray.900" type="text" size="lg" mb={6}

                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </Flex>

                            <Button
                                isDisabled={!subscriptions} isLoading={loader} onClick={handleUpdateHaircut} w="85%" mb={4} bg="button.cta" size="lg" _hover={{ bg: '#ffb13e' }}
                            >
                                Editar
                            </Button>

                            {!subscriptions && (
                                <Flex direction="row" align="center" justifyContent="center">
                                    <Text
                                        fontWeight="bold" color="#31fb6A" cursor="pointer"
                                    >
                                        Seja premium
                                    </Text>
                                    <Link href="/planos">
                                        <Text ml={1} color="white" >
                                            e tenha todos os acessos liberados.
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
        const { id } = ctx.params

        const check = await apiClient.get('/check')

        const response = await apiClient.get('/haircut/detail',
            {
                params: {
                    haircut_id: id
                }
            })

        return {
            props: {
                haircutDetail: response.data,
                subscriptions: check.data?.subscriptions?.status === 'active' ? true : false
            }

        }
    } catch (error) {
        console.log(error);
        return {
            redirect: {
                destination: '/haircuts',
                permanent: false
            }
        }

    }
})

