import {
  Heading,
  Center,
  Box,
  Button,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import queryString from 'query-string'

import { QUEUE_TITLES, BOARD_ID } from '../constants'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { NavBar } from '../components/Navbar'
import { GenerateUrls } from '../components/Support/GenerateUrls'

import PeopleOnPhones from '../assets/svg/people-on-phones.svg'

const Index = () => {
  const { t, lang } = useTranslation('common')
  const [queuePendingUrl, setQueuePendingUrl] = useState('') 

  useEffect(async () => {
    const query = queryString.parse(location.search)

    if(query.board_id) {
      await getBoardLists(query.board_id)
    } else {
      //  Defaults to board id in the netlify env
      await getBoardLists(BOARD_ID)
    }
  }, [])

  /**
   *  Gets a board with lists
   */
  const getBoardLists = async (boardId) => {
    if(boardId) {
      try {
        const boardLists = await axios.get(`/.netlify/functions/view?type=boardlists&board=${boardId}`)
        boardLists.data.forEach(list => {
          if(list.name.indexOf(QUEUE_TITLES.PENDING) > -1) {
            setQueuePendingUrl(location.origin + `/queue?id=${list.id}`)
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <Container>
      <NavBar
        w="100vw"
        px={8}
        />
      <Main
        w="100vw"
        px={8}
        >
        <Box>
          <Center>
            <PeopleOnPhones
              className="featured-image"
            />
          </Center>
          <Heading
            textStyle="heading3"
            textAlign="center"
            my={3}
            >
              QueueSG Support
          </Heading>
          <Text
            textStyle="body1"
            textAlign="center"
            mb={8}
            >
            Generate the URLs related to your Queue Here.
          </Text>

          <Center>
            <GenerateUrls />
          </Center>
        </Box>
      </Main>
      <Footer
        w="100vw"
        px={8}
        />
    </Container>
  )
}

export default Index
