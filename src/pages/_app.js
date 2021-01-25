import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { CookiesProvider } from 'react-cookie';
import theme from '../theme'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: 'light',
          useSystemColorMode: false,
        }}
      >
        <CookiesProvider>
          <Component {...pageProps} />
        </CookiesProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
