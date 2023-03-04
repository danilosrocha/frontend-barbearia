import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HaircutProvider } from '@/contexts/HaircutContext';

const colors = {
  barber: {
    900: '#12131b',
    400: '#1b1c29',
    100: '#c6c6c6',
  },
  button: {
    cta: '#fba931',
    default: '#fff',
    gray: '#dfdfdf',
    danger: '#ff4040',
  },
  orange: {
    900: '#fba931',
  }
}

const theme = extendTheme({ colors });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <HaircutProvider>
          <Component {...pageProps} />
          <ToastContainer autoClose={2500} />
        </HaircutProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}
