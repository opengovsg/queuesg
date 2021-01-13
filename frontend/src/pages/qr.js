import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Flex,
  Heading,
  Box,
  Input
} from '@chakra-ui/react'

import QRCode from 'qrcode.react'
const Index = () => {
  const router = useRouter()
  const [url, setUrl] = useState('')

  const handleChange = (event) => setUrl(event.target.value)

  useEffect(() => {
    setUrl(`${location.origin}/queue?id=5ffe9b5ed74ec20e4e4f8dc3`)
  }, [])

  return (
    <Container>
      <Main>
        <Heading fontSize="32px" fontWeight="semi" textAlign="center">Generate QR</Heading>

        <Flex direction="column" alignItems="center">
          <Input placeholder="John Tan" size="lg" paddingX="50px" fontSize="24px" my="20px"
            onChange={handleChange} value={url} />
          <Box marginY="30px">
            <QRCode value={url} size={220} />
          </Box>
        </Flex>
      </Main>
    </Container >
  )
}

export default Index
