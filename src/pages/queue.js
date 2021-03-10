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
  const [isQueueInactive, setIsQueueInactive] = useState(true)
  const [feedbackLink, setFeedbackLink] = useState()
  const [registrationFields, setRegistrationFields] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invalidNRIC, setInvalidNRIC] = useState(false)

  useEffect(() => {
    const query = queryString.parse(location.search)
    const currentQueueId = query.id
    const redirectUrl = isUserPartOfQueue(currentQueueId)

    // First check if user already has cookie for this queue id
    if (redirectUrl) {
      router.push(redirectUrl, redirectUrl, { locale: lang })
    }
    // Based on queue id, check if queue exists 
    else if (currentQueueId) {
      getQueue(currentQueueId)
    }
    //  Queue Id does not exist
    else {
      //  @TODO: handle if queue id is not present
    }
  }, [])

  /**
   * Checks if the user is part of the queue
   * 
   * @param {string} currentQueueId the id of the queue that the user is currently on
   * @returns {string|boolean} url to redirect the user to or FALSE if the user is not part of the current queue
   */
  const isUserPartOfQueue = (currentQueueId) => {
    // First check if user already has cookie for this queue id
    const ticketCookie = cookies['ticket']
    if (ticketCookie &&
      ticketCookie.queue &&
      ticketCookie.queue === currentQueueId &&
      ticketCookie.ticket && ticketCookie.ticketNumber
    ) {
      return `/ticket?queue=${ticketCookie.queue}&ticket=${ticketCookie.ticket}&ticketNumber=${ticketCookie.ticketNumber}`
    }

    return false
  }

  /**
   * Gets the queue Id
   * 
   * @param {string} queueId 
   */
  const getQueue = async (queueId) => {
    try {
      // Get the board queue belongs to this
      // 1. Verifies that queue actually exists
      // 2. Gets info stored as JSON in board description
      const getBoardQueueBelongsTo = await axios.get(`/.netlify/functions/queue?id=${queueId}`)
      const { name, desc } = getBoardQueueBelongsTo.data
      setIsQueueInactive(name.includes('[DISABLED]'))
      const cleanedName = name.replace('[DISABLED]', '').trim()
      setBoardName(cleanedName)
      const boardInfo = JSON.parse(desc)
      setRegistrationFields(boardInfo.registrationFields)
      setFeedbackLink(boardInfo.feedbackLink)
    } catch (err) {
      console.log(err);
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
      const feedback = feedbackLink ? `&feedback=${encodeURIComponent(feedbackLink)}` : ''
      const url = `/ticket?queue=${query.id}&ticket=${ticketId}&ticketNumber=${ticketNumber}${feedback}`
      router.push(url, url, { locale: lang })
    } catch (err) {
      console.log(err.response.status);
      setIsSubmitting(false)
    }
  }
  return (
    <Container>
      <NavBar />
      <Main>
        <Flex direction="column" alignItems="center">
          <Text textStyle="body2" fontSize="1.25rem" color="primary.500" textAlign="center">{t('queue-welcome-message')}</Text>
          <Text mt="6px" textStyle="heading1" fontSize="1.5rem" textAlign="center">{boardName}</Text>
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
            {isQueueInactive ?
              <Flex direction="column" alignItems="center">
                <Text textStyle="body1" fontSize="1.5rem" color="primary.500" textAlign="center" lineHeight="2.5rem">{t('queue-currently-inactive')}</Text>
              </Flex>
              :
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
                    isDisabled={registrationFields.length === 0}
                  >
                    {t('join-queue')}
                  </Button>
                </Flex>
              </form>
            }
          </Box>
        </Flex>
      </Main>
      <Footer />
    </Container>
  )
}


export default Index
