import { Box, Text, Flex, Button, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import LogoQueue from '../../assets/svg/logo-queue.svg'

export const NavBar = (props) => {
  const router = useRouter()

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w="400px"
      maxW="100%"
      pt={4}
      pb={8}
      px={4}
      bg="base.100"
      {...props}>
      <Box w="400px">
        <a href="/admin" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <LogoQueue
            height="40px"
            width="40px"
          />
          <Text textStyle="heading1" color="primary.500">&nbsp;&nbsp;Admin</Text>
        </a>
      </Box>
      <Box
        display={"block"}
        flexBasis={"auto"}
      >
        
      </Box>

    </Flex>
  )
}


