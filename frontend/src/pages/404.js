import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import useTranslation from 'next-translate/useTranslation'

import { NavBar } from '../components/Navbar'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import NotFound from '../assets/svg/not-found.svg'

const error404 = () => {
  const { t } = useTranslation('common')
  const goBack = () => {
    window.history.back()
  }

  return <Container>
    <NavBar />
    <Main>
      <Center>
        <Flex direction="column" >
          <NotFound
            className="featured-image"
          />
        </Flex>
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
    </Main>
    <Footer/>
  </Container>
}

export default error404