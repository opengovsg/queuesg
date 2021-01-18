import {
  Heading, Box, Text
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import useTranslation from 'next-translate/useTranslation'
import { NavBar } from '../components/Navbar'
import Link from 'next/link'

const Index = () => {
  const { t, lang } = useTranslation('common')
  return (
    <Container>
      <NavBar />
      <Main>

        <Box>
          <Heading fontSize="32px" fontWeight="semi" textAlign="center">{t('title')}</Heading>
          <Heading fontSize="64px" fontWeight="bold" textAlign="center" >QueueSG</Heading>
          <Text fontSize="24px" textAlign="center" my="30px" textDecoration="underline">
            <Link href="/queue?id=5ffe9b5ed74ec20e4e4f8dc3" locale={lang}>Try the demo</Link>
          </Text>
        </Box>
      </Main>
    </Container>
  )
}

export default Index
