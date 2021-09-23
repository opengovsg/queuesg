import {
  Box,
  Button,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'

import { UrlInput } from './UrlInput'
import { NETLIFY_FN_ENDPOINT, QUEUE_TITLES } from '../../constants'

export const GenerateUrls = () => {
  const [rootUrl, setRootUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [boardId, setBoardId] = useState()
  const [queueId, setQueueId] = useState()
  const [formError, setFormError] = useState(null)

  /**
   * Fetches the board details
   */
  const getBoard = async () => {
    try {
      const boardLists = await axios.get(`${NETLIFY_FN_ENDPOINT}/view?type=boardlists&board=${boardId}`)
      boardLists.data.forEach(list => {
        if (list.name.indexOf(QUEUE_TITLES.PENDING) > -1) {
          setQueueId(list.id)
        }
      })
    } catch (error) {
      console.error(error)
      setFormError('Invalid Board ID')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Generates the urls and displays them
   */
  const generateUrls = async () => {
    setLoading(true)
    setRootUrl(location.origin)
    setFormError(null)
    await getBoard()
    setLoading(false)
  }

  /**
   * Render the Request For Board Id view
   */
  const renderRequestForBoardId = () => {
    return <Flex direction="column">
      <Text
        pb="0.5rem"
        textStyle="subtitle1"
      >
        Trello Board ID
      </Text>
      <Input
        layerStyle="formInput"
        value={boardId}
        onChange={(event) => setBoardId(event.target.value)}
        placeholder="e.g. zJkm8jLLe"
        mb={1}
        required
        isInvalid={formError}
      />
      {
        formError !== null
          ?
          <Text textStyle="body2" color="error.500">{formError}</Text>
          :
          null
      }
      <Button
        bgColor="primary.500"
        borderRadius="3px"
        isFullWidth={true}
        color="white"
        size="lg"
        variant="solid"
        marginTop="2rem"
        isLoading={loading}
        onClick={generateUrls}
      >
        Generate URLs
      </Button>
    </Flex>
  }

  /**
   * Renders the urls
   */
  const renderQueueUrls = () => {
    return <Flex direction="column">
      <Text
        pb="0.5rem"
        textStyle="subtitle1"
      >
        Join The Queue
      </Text>
      <UrlInput
        url={`${rootUrl}/queue?id=${queueId}`}
      />

      <Text
        pt={4}
        pb="0.5rem"
        textStyle="subtitle1"
      >
        QR Code
      </Text>
      <UrlInput
        url={`${rootUrl}/qr?queue=${queueId}`}
      />

      <Text
        pt={4}
        pb="0.5rem"
        textStyle="subtitle1"
      >
        TV Queue View
      </Text>
      <UrlInput
        url={`${rootUrl}/view?board=${boardId}`}
      />
    </Flex>
  }

  return (
    <Box
      w="800px"
      layerStyle="card"
    >
      {
        queueId && boardId ?
          renderQueueUrls() :
          renderRequestForBoardId()
      }
    </Box>
  )
}
