import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Navbar'
import { authentication } from '../../utils'
import { useRouter } from 'next/router'
import { route } from 'next/dist/next-server/server/router'

const Index = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiConfig, setApiConfig] = useState()
  const [boardData, setBoardData] = useState()
  const [boardSettings, setBoardSettings] = useState()

  /**
   * TODO: move into a separate middleware service
   */
  const errorHandler = (error) => {
    const query = queryString.parse(location.search)

    if (error.response.status === 401) {
      alert(`Your login token is expired. Please login again`)
      router.push(`/admin/login?queueId=${query.queueId}`)
    } else {
      alert(`Error ${error.response.status} : ${error.response.data}`)
    }
  }
  
  /**
   * Gets the board description from trello directly
   */
  const getBoardDescription = async () => {
    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.queueId) { 
      try { 
        const response = await axios.get(`https://api.trello.com/1/boards/${apiConfig.queueId}?key=${apiConfig.key}&token=${apiConfig.token}`)
        
        setBoardSettings(JSON.parse(response.data.desc))
        setBoardData(response.data)
      } catch (error) {
        errorHandler(error)
      }
    }
  }
  /**
   * Updates the board settings
   * 
   * Note that there is a 16384 character limit
   */
  const updateBoardDescription = async () => {
    if (isSubmitting === true) return

    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.queueId) { 
      try { 
        setIsSubmitting(true)
        const response = await axios.put(`https://api.trello.com/1/boards/${apiConfig.queueId}?key=${apiConfig.key}&token=${apiConfig.token}`, {
          desc: JSON.stringify(boardSettings)
        })
        console.log(response.data)
      } catch (error) {
        errorHandler(error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  /**
   * Effects
   */
  useEffect(() => {
    const query = queryString.parse(location.search)
    let queueId = query.queueId

    if (queueId) {
      setApiConfig({
        token: authentication.getToken(),
        key: authentication.getKey(),
        queueId,
      })
    } else {
      queueId = prompt("Please enter your queue id", "E.g. Yg9jAKfn")
      router.push({
       pathname: `/admin`,
       query: {
         queueId
       }
      })
    }
  }, [])

  useEffect(() => {
    getBoardDescription()
  }, [apiConfig])

  /**
   * Confirm with the user that she/he wants to logout
   */
  const confirmLogout = () => {
    if(confirm('Please confirm that you would like to logout?')) {
      router.push('/admin/logout')
    }
  }

  /**
   * On Categories Change
   */
   const onCategoriesChange = (e) => {
    const categories = e.target.value.split(",")

    setBoardSettings({
      ...boardSettings,
      [e.target.id]: categories
    })
  }

  /**
   * On Text Input Change
   */
  const onTextInputChange = (e) => {
    setBoardSettings({
      ...boardSettings,
      [e.target.id]: e.target.value
    })
  }

  /**
   * On Checkbox Input Change
   */
   const onCheckboxInputChange = (id, value) => {
    setBoardSettings({
      ...boardSettings,
      [id]: value
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
      <NavBar width="100%" />
      <Main justifyContent="start" minHeight="90vh" width="100%">
        <Center>
          {/* TODO: migrate to components for sanity */}
          {
            boardData 
            ?
            <Flex width="100%" maxW="1200px" flexDir="column">
              <Flex width="100%" flexDir="row" justifyContent="space-between" alignItems="center" pb="10">
                <Text textStyle="heading1" color="primary.600" textAlign="center">
                  Admin For {boardData.name}
                </Text>

                <Button
                  flex
                  colorScheme="orange"
                  borderRadius="3px"
                  color="white"
                  variant="solid"
                  onClick={confirmLogout}
                >
                  Logout
                </Button>
              </Flex>

              <Box
                layerStyle="card"
                width="100%"
              >
                <form
                  onSubmit={submit}
                  >
                  {/* registration fields */}
                  <Flex
                    pt="0.5rem"
                    pb="0.5rem"
                    >
                    <FormControl id="registrationFields">
                      <FormLabel>Registration Fields</FormLabel>
                      <CheckboxGroup
                        colorScheme="primary"
                        value={boardSettings.registrationFields}
                        onChange={(value) => onCheckboxInputChange('registrationFields', value)}
                        >
                        <VStack>
                          <Checkbox value="name">Full Name</Checkbox>
                          <Checkbox value="contact">Phone Number</Checkbox>
                          <Checkbox value="nric">NRIC</Checkbox>
                        </VStack>
                      </CheckboxGroup>
                    </FormControl>
                  </Flex>

                  {/* categories */}
                  <Flex
                    pt="0.5rem"
                    pb="0.5rem"
                    >
                    <FormControl id="categories">
                      <FormLabel>Categories</FormLabel>
                      <Input type="text" value={boardSettings.categories} onChange={onCategoriesChange} />
                    </FormControl>
                  </Flex>

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

                  {/* privacy link */}
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
                    isLoading={isSubmitting}
                    loadingText="Updating..."
                    colorScheme="primary"
                    borderRadius="3px"
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
