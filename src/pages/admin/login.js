import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import Head from 'next/head'
import {
  Button,
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Admin/Navbar'
import InputText from '../../components/Admin/InputText'

import ManWithHourglass from "../../assets/svg/man-with-hourglass.svg"

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [boardId, setBoardId] = useState()

  useEffect(() => {
    const query = queryString.parse(location.search)
    setBoardId(query.boardId)
  },[])

  const updateBoardId = (e) => {
    setBoardId(e.target.value)
  }

  /**
   * Go to Trello to authorise the app
   */
  const authoriseApp = async () => {
    if (boardId) {
      try {
        const response = await axios.post(`/.netlify/functions/authorize`, {
          boardId,
        })
        if (response.data.authorizeUrl) {
          window.location.href = response.data.authorizeUrl
        } else {
          throw Error("Authorise URL was not defined.")
        }
      } catch (error) {
        console.error(error)
        alert(`Error: ${error.message}`)
      }
    }
  }

  return <>
    <Head>
      <title>Login to Admin - QueueUp SG</title>
    </Head>
    <Container>
      <NavBar width="100%" />
      <Main justifyContent="start" minHeight="90vh" width="100%">
        <Flex direction="column" alignItems="center">
          <Flex direction="column" alignItems="center">
            <ManWithHourglass
              className="featured-image"
            />
          </Flex>
          <Box
            layerStyle="card"
          >
            <form
              onSubmit={authoriseApp}
              >
              <InputText
                id="boardId"
                label="Board ID"
                required={true}
                onChange={updateBoardId}
                helperText={
                  <Text onClick={onOpen} cursor="pointer" _hover={{ textDecoration: 'underline' }}>
                    Don't Know Your Board ID?
                  </Text>
                }
                value={boardId}
                />

              <Button
                flex
                isLoading={isLoading}
                isFullWidth
                colorScheme="primary"
                borderRadius="3px"
                color="white"
                variant="solid"
                size="lg"
                marginTop="1.5rem"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Box>
        </Flex>
      </Main>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Don't Know Your Board ID?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              If the URL to your trello board is 
              <Box bg="gray.200" p="2" my="5">
                <Text fontSize="xs"><code flex>https://trello.com/b/<Box display="inline" bg="primary.500" color="white">zlksMWQT</Box>/psd-center-at-tampines</code></Text>
              </Box>
              your board id is <Box display="inline" bg="primary.500" color="white">zlksMWQT</Box>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  </>
}

export default Index
