import { Flex, } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../public/images/logo-simplificada.svg'
import { Spinner } from '@chakra-ui/react'
import Router from "next/router";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { useEffect } from "react";

export default function Preloader() {

  useEffect(() => {
    setTimeout(() => {
        Router.push('/fast');
    }, 1);

  }, []);

  return (
    <>
      <Head>
        <title>Rocha's Client - Bigode Grosso</title>
      </Head>
      <Flex background="barber.900" minH="100vh" alignItems="center" justifyContent="center">
        <Flex width={640} direction="column" p={14} rounded={8} alignItems="center" justifyContent="center">

          <Image
            src={logoImg}
            quality={100}
            width={240}
            alt="Logo Rocha's Client"
          />

          <Spinner color='button.cta' speed='0.8s' size='lg' />
        </Flex>
      </Flex>

    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

  return {
    props: {}
  }
})