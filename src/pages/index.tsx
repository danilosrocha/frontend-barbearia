import { Flex, } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../public/images/logo-simplificada.svg'
import { Spinner } from '@chakra-ui/react'
import { useRouter } from "next/router";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { useEffect, useState } from "react";

export default function Preloader() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('A página não foi carregada em tempo hábil. Redirecionando manualmente...');
        router.push('/fast');
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, [loading, router]);

  return (
    <>
      <Head>
        <title>Rocha's Client - Bigode Grosso</title>
      </Head>
      <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
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