import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
} from '@chakra-ui/react'
import Head from 'next/head'
import { ArrowBackIcon } from '@chakra-ui/icons'
import useTranslation from 'next-translate/useTranslation'

import { NavBar } from '../components/Navbar'
import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import NotFound from '../assets/svg/not-found.svg'

const error404 = () => {
  const { t } = useTranslation('common')
  const goBack = () => {
    window.history.back()
  }

  return <>
    <Head>
      <title>404 - Not Error</title>
    </Head>
    <Container>
      <NavBar />
      <Flex
        h="calc(100vh - 72px - 215px)"
        flexDirection="column"
        justifyContent="center"
        px={4}
        >
        <Center
          flexDirection="column"
        >
          <Center>
            <NotFound
              className="featured-image"
            />
          </Center>
          <Box textAlign="center">
            <Heading textStyle="display3" my={4}>
              {t("we-cant-seem-to-find-the-page-you-are-looking-for")}
            </Heading>
            <Button
              bgColor="primary.500"
              color="white"
              leftIcon={<ArrowBackIcon />}
              onClick={goBack}
            >
              {t('go-back')}
            </Button>
          </Box>
        </Center>
      </Flex>
      <Footer/>
    </Container>
  </>
}

export default error404