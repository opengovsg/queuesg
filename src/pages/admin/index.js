import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Navbar'
import { authentication } from '../../utils'

const Index = () => {
  const [apiConfig, setApiConfig] = useState()
  const [boardData, setBoardData] = useState()
  const [boardSettings, setBoardSettings] = useState()

  /**
   * Services
   */
  /**
   * Gets the board description from trello directly
   */
  const getBoardDescription = async () => {
    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.queueId) { 
      const response = await axios.get(`https://api.trello.com/1/boards/${apiConfig.queueId}?key=${apiConfig.key}&token=${apiConfig.token}`)
      console.log(response.data)
      
      setBoardSettings(JSON.parse(response.data.desc))
      setBoardData(response.data)
    }
  }
  /**
   * Updates the board settings
   * 
   * Note that there is a 16384 character limit
   */
  const updateBoardDescription = async () => {
    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.queueId) { 
      const response = await axios.put(`https://api.trello.com/1/boards/${apiConfig.queueId}?key=${apiConfig.key}&token=${apiConfig.token}`, {
        desc: JSON.stringify(boardSettings)
      })
      console.log(response.data)
    }
  }

  /**
   * Effects
   */
  useEffect(() => {
    const query = queryString.parse(location.search)
    setApiConfig({
      token: authentication.getToken(),
      key: authentication.getKey(),
      queueId: query.queueId,
    })
  }, [])

  useEffect(() => {
    getBoardDescription()
  }, [apiConfig])

  /**
   * On Text Input Change
   */
  const onTextInputChange = (e) => {
    console.log(e.target)
    setBoardSettings({
      ...boardSettings,
      [e.target.id]: e.target.value
    })
  }

  /**
   * Submits the  form
   * 
   * @param {} e 
   */
  const submit = async (e) => {
    try {
      e.preventDefault()
      await updateBoardDescription()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <NavBar width="100%" maxWidth="600px" />
      <Main justifyContent="start" minHeight="90vh" zIndex="1">
        <Center>
          {/* TODO: migrate to components for sanity */}
          {
            boardData 
            ?
            <Flex flexDir="column">
              <Text textStyle="heading1" color="primary.600" textAlign="center">
                Admin For {boardData.name}
              </Text>

              <Box
                layerStyle="card"
              >
                <form
                  onSubmit={submit}
                  >
                  {/* feedback link */}
                  <Flex
                    pt="0.5rem"
                    pb="0.5rem"
                    >
                    <FormControl id="feedbackLink">
                      <FormLabel>Feedback Link</FormLabel>
                      <Input type="url" value={boardSettings.feedbackLink} onChange={onTextInputChange} />
                    </FormControl>
                  </Flex>


                  {/* feedback link */}
                  <Flex
                    pt="0.5rem"
                    pb="0.5rem"
                    >
                    <FormControl id="privacyPolicyLink">
                      <FormLabel>Privacy Policy Link</FormLabel>
                      <Input type="url" value={boardSettings.privacyPolicyLink} onChange={onTextInputChange} />
                    </FormControl>
                  </Flex>

                  {/* Submit */}
                  <Button
                    loadingText="loading..."
                    colorScheme="primary"
                    borderRadius="3px"
                    isFullWidth={true}
                    color="white"
                    size="lg"
                    variant="solid"
                    marginTop="1.5rem"
                    type="submit"
                  >
                    Save Settings
                  </Button>
                </form>
              </Box>
            </Flex>
            :
            <Spinner />
          }
        </Center>
      </Main>
    </Container>
  )
}

export default Index
