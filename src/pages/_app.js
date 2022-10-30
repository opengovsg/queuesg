import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { CookiesProvider } from 'react-cookie';
import theme from '../theme'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: 'light',
        }}
      >
        <CookiesProvider>
          <Head>
            <title>QueueSG</title>
          </Head>
          <Component {...pageProps} />
        </CookiesProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
