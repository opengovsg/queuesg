import {
  Box,
  Button,
  Flex,
  Input,
  Heading,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'

import { UrlInput } from './UrlInput'
import { QUEUE_TITLES } from '../../constants'

export const GenerateUrls = () => {
  const { t, lang } = useTranslation('common')
  const [rootUrl, setRootUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [boardId, setBoardId] = useState()
  const [queueId, setQueueId] = useState()
  const handleChange = (event) => setBoardId(event.target.value)

  /**
   * Effects
   */
  useEffect(() => {
    console.log('render')
  }, [boardId, queueId])

  /**
   * Fetches the board details
   */
  const getBoard = async () => {
    const boardLists = await axios.get(`/.netlify/functions/view?type=boardlists&board=${boardId}`)
    boardLists.data.forEach(list => {
      if(list.name.indexOf(QUEUE_TITLES.PENDING) > -1) {
        setQueueId(list.id)
      }
    })
  }

  /**
   * Generates the urls and displays them
   */
  const generateUrls = () => {
    try {
      setLoading(true)
      setRootUrl(location.origin)
      getBoard()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render the Request For Board Id view
   */
  const RequestForBoardId = () => {
    return <>
      <Flex direction="column">
        <Text
          pb="0.5rem"
          textStyle="subtitle1"
        >
          Trello Board ID
        </Text>
        <Input
          layerStyle="formInput"
          value={boardId}
          onChange={handleChange}
          placeholder="e.g. zJkm8jLLe"
          required
        />
      </Flex>
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
  </>
  }

  /**
   * Renders Error
   */
  const Errors = () => {
    <>
      <Heading
        textStyle="subtitle1"
        textAlign="center"
        mt={4}
        mb={4}
      >
        Oops. Something went wrong.
      </Heading>
      <Text
        textStyle="body1"
        textAlign="center"
        mb={4}
        >
        Please refresh and try again.
      </Text>
      <Button
        bgColor="primary.500"
        borderRadius="3px"
        isFullWidth={true}
        color="white"
        size="lg"
        variant="solid"
        marginTop="2rem"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </Button>
    </>
  }

  /**
   * Renders the urls
   */
  const QueueUrls = () => {
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
        queueId && boardId 
        ?
        <QueueUrls />
        :
        <RequestForBoardId />
      }
    </Box>
  )
}
