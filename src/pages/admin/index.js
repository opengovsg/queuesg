import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import {
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { NavBar } from '../../components/Admin/Navbar'
import InputText from '../../components/Admin/InputText'
import InputCheckbox from '../../components/Admin/InputCheckbox'
import { authentication } from '../../utils'
import { useRouter } from 'next/router'

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
      router.push(`/admin/login?boardId=${query.boardId}`)
    } else {
      alert(`Error ${error.response.status} : ${error.response.data}`)
    }
  }
  
  /**
   * Gets the board description from trello directly
   */
  const getBoardDescription = async () => {
    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) { 
      try { 
        const response = await axios.get(`https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}`)
        
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

    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) { 
      try { 
        setIsSubmitting(true)
        const response = await axios.put(`https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}`, {
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
    let boardId = query.boardId

    if (boardId) {
      setApiConfig({
        token: authentication.getToken(),
        key: authentication.getKey(),
        boardId,
      })
    } else {
      boardId = prompt("Please enter your queue id", "E.g. Yg9jAKfn")
      router.push({
       pathname: `/admin`,
       query: {
         boardId
       }
      })
      setApiConfig({
        token: authentication.getToken(),
        key: authentication.getKey(),
        boardId,
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
                  {boardData.name}
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
                  <InputCheckbox
                    id="registrationFields"
                    label="Registration Fields"
                    value={boardSettings.registrationFields}
                    onChange={(value) => onCheckboxInputChange('registrationFields', value)}
                    options={{
                      name: "Full Name",
                      contact: "Phone Number",
                      nric: "NRIC"
                    }}
                   />

                  {/* categories */}
                  <InputText
                    id="categories"
                    label="Categories"
                    type="text"
                    value={boardSettings.categories}
                    onChange={onCategoriesChange} 
                    />

                  {/* feedback link */}
                  <InputText
                    id="feedbackLink"
                    label="Feedback Link"
                    type="url"
                    value={boardSettings.feedbackLink}
                    onChange={onTextInputChange} 
                    />

                  {/* privacy link */}
                  <InputText
                    id="privacyPolicyLink"
                    label="Privacy Policy Link"
                    type="url"
                    value={boardSettings.privacyPolicyLink}
                    onChange={onTextInputChange} 
                    />

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
