import axios from 'axios'
import { useEffect, useState } from 'react'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import Head from'next/head'
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Spinner,
  Text,
} from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import  {
  InputCheckbox,
  InputEditable,
  InputText,
  InputTextarea,
  Navbar,
  OpeningHours,
} from '../../components/Admin'
import { authentication } from '../../utils'

const Index = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiConfig, setApiConfig] = useState()
  const [boardData, setBoardData] = useState()
  const [editableSettings, setEditableSettings] = useState()

  /**
   * TODO: move into a separate middleware service
   */
  const errorHandler = (error) => {
    const query = queryString.parse(location.search)
    
    if (error.response) {
      if (error.response.status === 401) {
        alert(`Your login token is expired. Please login again`)
        router.push(`/admin/login?boardId=${query.boardId}`)
      } else {
        alert(`Error ${error.response.status} : ${error.response.data}`)
      }
    } else {
      console.error(error)
      alert(`Error: ${error.message}`)
    }
  }

  /**
   * Gets the board data from trello directly
   */
  const getBoard = async () => {
    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) { 
      try { 
        const response = await axios.get(`https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}`)
        
        console.log(response.data)
        setEditableSettings(JSON.parse(response.data.desc))
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
  const updateBoard = async (type = "settings", data = null) => {
    if (isSubmitting === true) return

    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) { 
      try { 
        setIsSubmitting(true)
        const settings = {}

        switch(type) {
          case "settings":
            const desc = JSON.stringify(editableSettings)
            //  Verify that the board desc does not exceed 16384 characters
            //  https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put
            if (desc.length > 16384) throw Error("Could not save due to setting JSON length exceeding 16384")
            settings.desc = JSON.stringify(editableSettings)
            break
          
          case "name":
            //  Return if the board name is not changed
            if (boardData.name === data) return

            //  Update the board name
            if (data) {
              settings.name = String(data)
            } else {
              throw Error(`Board name cannot be empty`)
            }
            break

          default:
            throw Error(`Wrong type: ${type} provided in updating board`)
        }

        await axios.put(`https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}`, settings)
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
    const token = authentication.getToken()
    const key = authentication.getKey()

    let boardId = query.boardId || prompt("Please enter your queue id", "E.g. Yg9jAKfn")

    if (token && key) {
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
    } else {
      //  redirects the user to the login page
      router.push({
        pathname: `/admin/login`,
        query: {
          boardId
        }
      })
    }
  }, [])

  useEffect(() => {
    getBoard()
  }, [apiConfig])

  /**
   * On Categories Change
   */
   const onCategoriesChange = (e) => {
    const categories = e.target.value.split(",")

    setEditableSettings({
      ...editableSettings,
      [e.target.id]: categories
    })
  }

  /**
   * On Text Input Change
   */
  const onTextInputChange = (e) => {
    setEditableSettings({
      ...editableSettings,
      [e.target.id]: e.target.value
    })
  }

  /**
   * On Open Hours Input Change
   */
  const onOpeningHoursInputChange = (openingHours) => {
    setEditableSettings({
      ...editableSettings,
      openingHours
    })
  }

  /**
   * On Checkbox Input Change
   */
   const onCheckboxInputChange = (id, value) => {
    setEditableSettings({
      ...editableSettings,
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
      await updateBoard("settings")
    } catch (error) {
      console.error(error)
    }
  }

  return <>
    <Head>
      <title>Admin - QueueUp Sg</title>
    </Head>
    <Container>
      <Navbar width="100%" />
      <Main justifyContent="start" minHeight="90vh" width="100%">
        <Center>
          {/* TODO: migrate to components for sanity */}
          {
            boardData 
            ?
            <Flex width="100%" maxW="1200px" flexDir="column">
              <Flex width="100%" flexDir="row" justifyContent="space-between" alignItems="center" pb="10">
                <InputEditable
                  color="primary.500"
                  fontSize="xl"
                  isLoading={isSubmitting}
                  onSubmit={(boardName) => updateBoard("name", boardName)}
                  textStyle="heading1"
                  value={boardData.name}
                  />

                <Button
                  flex
                  colorScheme="blue"
                  borderRadius="3px"
                  color="white"
                  variant="solid"
                  onClick={() => window.open(boardData.shortUrl)}
                >
                  Go To Trello
                </Button>
              </Flex>

              <Box
                layerStyle="card"
                width="100%"
              >
                <form
                  onSubmit={submit}
                  >
                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <Box w="100%">
                      {/* registration fields */}
                      <InputCheckbox
                        id="registrationFields"
                        label="Registration Fields"
                        value={editableSettings.registrationFields}
                        onChange={(value) => onCheckboxInputChange('registrationFields', value)}
                        options={{
                          name: "Full Name",
                          contact: "Phone Number",
                          nric: "NRIC",
                          postalcode: "Postal Code",
                          description: "Description"
                        }}
                      />

                      {/* categories */}
                      <InputTextarea
                        id="categories"
                        label="Categories"
                        type="text"
                        value={editableSettings.categories}
                        onChange={onCategoriesChange} 
                        />

                      {/* feedback link */}
                      <InputText
                        id="feedbackLink"
                        label="Feedback Link"
                        type="url"
                        value={editableSettings.feedbackLink}
                        onChange={onTextInputChange} 
                        />

                      {/* privacy link */}
                      <InputText
                        id="privacyPolicyLink"
                        label="Privacy Policy Link"
                        type="url"
                        value={editableSettings.privacyPolicyLink}
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
                    </Box>
                    <Box w="100%">
                      {/* Opening Hours */}
                      <OpeningHours
                        id="openingHours"
                        label="Opening Hours"
                        value={editableSettings.openingHours || {}}
                        onChange={onOpeningHoursInputChange} 
                        />
                    </Box>
                  </Grid>
                </form>
              </Box>
            </Flex>
            :
            <Spinner />
          }
        </Center>
      </Main>
    </Container>
  </>
}

export default Index
