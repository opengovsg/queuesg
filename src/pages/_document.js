import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
          <link rel="icon" href="/favicon.svg"></link>
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript initialColorMode={'light'} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
