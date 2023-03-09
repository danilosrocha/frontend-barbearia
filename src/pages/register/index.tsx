import { AuthContext } from "@/contexts/AuthContext";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import logoImg from '../../../public/images/logo.svg'

export default function Register() {
  const { signUp } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loader, setLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [typePassword, setTypePassword] = useState("password")

  async function handleRegister() {
    if (!name || !email || !password) {
      toast.warning("Preencha todos os campos!")
      return
    }

    setLoader(true)
    await signUp({ name, email, password, code })
    setLoader(false)
  }

  function handleShowPassword() {
    setShowPassword(!showPassword)
    if (showPassword !== false) {
      setTypePassword('password')
      return
    }
    setTypePassword('text')
  }

  return (
    <>
      <Head>
        <title>Rocha's Client Barber - Faça seu cadastro</title>
      </Head>

      <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
        <Flex width={640} direction="column" p={14} rounded={8}>
          <Center p={4} mb={3}>
            <Image
              src={logoImg}
              quality={100}
              width={300}
              objectFit="fill"
              alt="Logo Rocha's Client"
            />
          </Center>

          <Input
            background="barber.400"
            _hover={{ bg: "#030303" }}
            color="white"
            variant="filled"
            size="lg"
            placeholder="Nome da barbearia"
            type="text"
            mb={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            background="barber.400"
            _hover={{ bg: "#030303" }}
            color="white"
            variant="filled"
            size="lg"
            placeholder="Digite o código"
            type="email"
            mb={3}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Input
            background="barber.400"
            _hover={{ bg: "#030303" }}
            color="white"
            variant="filled"
            size="lg"
            placeholder="Digite seu email"
            type="email"
            mb={3}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Flex direction="row" alignItems="center" justifyContent="space-between" background="barber.400" mb={6} rounded={8} position="relative">
            <Input
              background="barber.400"
              color="white"
              variant="filled"
              size="lg"
              placeholder="Digite sua senha"
              type={typePassword}
              value={password}
              _hover={{ bg: "#030303" }}
              onChange={(e) => setPassword(e.target.value)}

            />
            <Button onClick={handleShowPassword} position="absolute" right={0} bg="transparent" _hover={{ bg: "transparent" }}>
              {showPassword ? <FiEye color="white" /> : <FiEyeOff color="white" />}
            </Button>
          </Flex>

          <Button
            background="button.cta"
            mb={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#ffb13e" }}
            onClick={handleRegister}
            isLoading={loader}
          >
            Cadastrar
          </Button>

          <Center mt={2}>
            <Link href="/login">
              <Text color="white" cursor="pointer">Já possui conta? <strong>Faça login</strong></Text>
            </Link>
          </Center>

        </Flex>
      </Flex>

    </>
  )
}

export const getServerSideProps = canSSRGuest(async () => {


  return {
    props: {

    }

  }
})
