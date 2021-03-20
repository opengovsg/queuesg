import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import {
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

  const getBoardDescription = async () => {
    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.queueId) { 
      const response = await axios.get(`https://api.trello.com/1/boards/${apiConfig.queueId}?key=${apiConfig.key}&token=${apiConfig.token}`)
      console.log(response.data)
      
      setBoardSettings(JSON.parse(response.data.desc))
      setBoardData(response.data)
    }
  }

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

              {/* feedback link */}
              <Flex>
                <FormControl id="feedbackLink">
                  <FormLabel>Feedback Link</FormLabel>
                  <Input type="url" value={boardSettings.feedbackLink} onChange={onTextInputChange} />
                </FormControl>
              </Flex>


              {/* feedback link */}
              <Flex>
                <FormControl id="privacyPolicyLink">
                  <FormLabel>Privacy Policy Link</FormLabel>
                  <Input type="url" value={boardSettings.privacyPolicyLink} onChange={onTextInputChange} />
                </FormControl>
              </Flex>
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
