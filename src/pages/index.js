import {
  Heading,
  Center,
  Box,
  Button
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

import { QUEUE_TITLES, BOARD_ID } from '../constants'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { NavBar } from '../components/Navbar'

import PeopleOnPhones from '../assets/svg/people-on-phones.svg'

const Index = () => {
  const { t, lang } = useTranslation('common')
  const [queuePendingUrl, setQueuePendingUrl] = useState('') 

  useEffect(async () => {
    console.log(BOARD_ID)
    await getBoardLists(BOARD_ID)
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
      <NavBar />
      <Main>
        <Box>
          <Heading
            textStyle="heading3"
            textAlign="center"
            mb={8}
            >
            {t('demo-title')}
          </Heading>
          <Center>
            <PeopleOnPhones
              className="featured-image"
            />
          </Center>
          <Center
            mt="4rem"
            >
            <Link
              href={`${queuePendingUrl}`}
              >
              <Button
                bgColor="primary.500"
                borderRadius="3px"
                isFullWidth={true}
                color="white"
                size="lg"
                variant="solid"
                type="submit"
              >
                {t('try-the-demo')}
              </Button>
            </Link>
          </Center>
        </Box>
      </Main>
      <Footer />
    </Container>
  )
}

export default Index
