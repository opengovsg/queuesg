import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import axios from 'axios'
import { validate } from 'nric'
import { NavBar } from '../components/Navbar'

import ManWithHourglass from "../../src/assets/svg/man-with-hourglass.svg"

import {
  Text,
  Flex,
  Box,
  Button,
  Input,
  Textarea
} from '@chakra-ui/react'
import { useCookies } from 'react-cookie';
import useTranslation from 'next-translate/useTranslation'
const Index = () => {
  const { t, lang } = useTranslation('common')
  const router = useRouter()
  const [cookies, setCookie] = useCookies(['ticket']);

  const [boardName, setBoardName] = useState('')
  const [message, setMessage] = useState('')
  const [registrationFields, setRegistrationFields] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [invalidNRIC, setInvalidNRIC] = useState(false)
  useEffect(() => {
    const query = queryString.parse(location.search);

    // First check if user already has cookie for this queue id
    const ticketCookie = cookies['ticket']
    if (ticketCookie && ticketCookie.queue) {
      if (ticketCookie.queue === query.id && ticketCookie.ticket && ticketCookie.ticketNumber) {
        const url = `/ticket?queue=${ticketCookie.queue}&ticket=${ticketCookie.ticket}&ticketNumber=${ticketCookie.ticketNumber}`
        router.push(url, url, { locale: lang })
      }
      return
    }
    // Based on queue id, check if queue exists 
    if (query.id) {
      getQueue(query.id)
    }
  }, [])

  const getQueue = async (queue) => {
    try {
      // Get the board queue belongs to this
      // 1. Verifies that queue actually exists
      // 2. Gets info stored as JSON in board description
      const getBoardQueueBelongsTo = await axios.get(`/.netlify/functions/queue?id=${queue}`)
      const { name, desc } = getBoardQueueBelongsTo.data
      setBoardName(name)
      const boardInfo = JSON.parse(desc)
      setMessage(boardInfo.message)
      setRegistrationFields(boardInfo.registrationFields)
    } catch (err) {
      console.log(err.response);
    }
  }

  const submit = async (e) => {
    try {
      e.preventDefault()

      // Check if NRIC is valid
      if (registrationFields.includes('nric')) {
        if (validate(e.target['nric'].value) === false) {
          setInvalidNRIC(true)
          return
        } else {
          setInvalidNRIC(false)
        }
      }

      //  Don't submit if it is submitting
      if (isSubmitting) return
      setIsSubmitting(true)

      let desc = {}
      registrationFields.forEach((key) => {
        if (e.target[key].value !== '') {
          desc[key] = e.target[key].value
        }
      });
      // call netlify function to create a ticket
      // for that queue, return the ticket id and redirect to ticket page
      const query = queryString.parse(location.search);
      const postJoinQueue = await axios.post(`/.netlify/functions/ticket?queue=${query.id}`, { desc: desc })
      const { ticketId, ticketNumber } = postJoinQueue.data
      const url = `/ticket?queue=${query.id}&ticket=${ticketId}&ticketNumber=${ticketNumber}`
      router.push(url, url, { locale: lang })
    } catch (err) {
      console.log(err.response)
      setIsSubmitting(false)
    }
  }
  return (
    <Container>
      <NavBar />
      <Main>
        <Flex direction="column" alignItems="center">
          <Text textStyle="display3" color="primary.500" fontWeight="400" textAlign="center">{t('queue-welcome-message')}</Text>
          <Text textStyle="display3" textAlign="center">{boardName}</Text>
        </Flex>
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
              onSubmit={submit}
            >
              <Flex direction="column">
                {registrationFields.includes('name') && <>
                  <Text
                    pb="0.5rem"
                    textStyle="subtitle1"
                  >
                    {t('your-name')}
                  </Text>
                  <Input
                    layerStyle="formInput"
                    name="name"
                    required
                  />
                </>}
                {registrationFields.includes('contact') && <>
                  <Text
                    pt="0.5rem"
                    pb="0.5rem"
                    textStyle="subtitle1"
                  >
                    {t('mobile-number')}
                  </Text>
                  <Input
                    layerStyle="formInput"
                    type="tel"
                    name="contact"
                    pattern="^(8|9)(\d{7})$"
                    maxLength="8"
                    minLength="8"
                    required
                    title="Mobile number should be an 8 digit Singapore number i.e. 8xxxxxxx"
                  />
                </>}
                {registrationFields.includes('postalcode') && <>
                  <Text
                    pt="0.5rem"
                    pb="0.5rem"
                    textStyle="subtitle1"
                  >
                    {t('postal-code')}
                  </Text>
                  <Input
                    layerStyle="formInput"
                    type="tel"
                    name="postalcode"
                    pattern="^(\d{6})$"
                    maxLength="6"
                    minLength="6"
                    placeholder="123456"
                    required
                    title="Postal code should be an 6 digit number"
                  />
                </>}

                {registrationFields.includes('nric') && <>
                  <Text
                    pt="0.5rem"
                    pb="0.5rem"
                    textStyle="subtitle1"
                  >
                    NRIC
                  </Text>
                  <Input
                    layerStyle="formInput"
                    isInvalid={invalidNRIC && "error.500"}
                    onChange={() => setInvalidNRIC(false)}
                    name="nric"
                    maxLength="9"
                    minLength="9"
                    placeholder="SxxxxxxxA"
                    required
                  />
                  {invalidNRIC && <Text color="error.500" mt="-10px"> {t('invalid')} NRIC</Text>}
                </>}
                {registrationFields.includes('description') && <>
                  <Text
                    pb="0.5rem"
                    textStyle="subtitle1"
                  >
                    {t('description')}
                  </Text>
                  <Textarea
                    layerStyle="formInput"
                    maxLength="280"
                    name="description"
                    placeholder="Description"
                    size="sm"
                    resize={'none'}
                  />
                </>}

                <Button
                  isLoading={isSubmitting}
                  loadingText={t('joining')}
                  colorScheme="primary"
                  borderRadius="3px"
                  isFullWidth={true}
                  color="white"
                  size="lg"
                  variant="solid"
                  marginTop="10px"
                  type="submit"
                >
                  {t('join-queue')}
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Main>
      <Footer />
    </Container>
  )
}


export default Index
