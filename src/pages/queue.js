import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import axios from 'axios'
import url from 'is-url'
import { validate } from 'nric'

import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { NavBar } from '../components/Navbar'
import { NoSuchQueue } from '../components/View/NoSuchQueue'

import ManWithHourglass from "../../src/assets/svg/man-with-hourglass.svg"

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  Select
} from '@chakra-ui/react'
import { useCookies } from 'react-cookie';
import useTranslation from 'next-translate/useTranslation'
const Index = () => {
  const { t, lang } = useTranslation('common')
  const router = useRouter()
  const [cookies, setCookie] = useCookies(['ticket']);

  const [boardName, setBoardName] = useState('')
  const [isQueueValid, setIsQueueValid] = useState(true)
  const [isQueueInactive, setIsQueueInactive] = useState(true)
  const [feedbackLink, setFeedbackLink] = useState()
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState()
  const [registrationFields, setRegistrationFields] = useState([])
  const [categories, setCategories] = useState([])
  const [waitTimePerTicket, setWaitTimePerTicket] = useState()
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
      setIsQueueValid(false)
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
      //  Set Registration Fields
      setRegistrationFields(boardInfo.registrationFields)

      //  Feedback Link
      if (boardInfo.feedbackLink && url(boardInfo.feedbackLink)) {
        setFeedbackLink(boardInfo.feedbackLink)
      }

      //  Privacy Policy
      if (boardInfo.privacyPolicyLink && url(boardInfo.privacyPolicyLink)) {
        setPrivacyPolicyLink(boardInfo.privacyPolicyLink)
      }

      //  Categories
      if (boardInfo.categories && Array.isArray(boardInfo.categories)) {
        setCategories(boardInfo.categories)
      }

      //  Feedback Link
      if (boardInfo.waitTimePerTicket && !isNaN(Number(boardInfo.waitTimePerTicket))) {
        setWaitTimePerTicket(boardInfo.waitTimePerTicket)
      }

    } catch (err) {
      console.log(err)
      setIsQueueValid(false)
    }
  }

  const submit = async (e) => {
    try {
      e.preventDefault()

      //  Don't submit if it is submitting
      if (isSubmitting) return
      setIsSubmitting(true)

      // Check if NRIC is valid
      if (registrationFields.includes('nric')) {
        if (validate(e.target['nric'].value) === false) {
          setInvalidNRIC(true)
          return
        } else {
          setInvalidNRIC(false)
        }
      }

      let desc = {}
      registrationFields.forEach((key) => {
        if (e.target[key].value !== '') {
          desc[key] = e.target[key].value
        }
      });
      if (Array.isArray(categories) && categories.length > 0) {
        desc.category = e.target.category.value
      }

      // call netlify function to create a ticket
      // for that queue, return the ticket id and redirect to ticket page
      const query = queryString.parse(location.search);
      const postJoinQueue = await axios.post(`/.netlify/functions/ticket?queue=${query.id}`, { desc })
      const { ticketId, ticketNumber } = postJoinQueue.data
      const feedback = feedbackLink ? `&feedback=${encodeURIComponent(feedbackLink)}` : ''
      const waitTime = `&waitTimePerTicket=${encodeURIComponent(waitTimePerTicket)}`
      const url = `/ticket?queue=${query.id}&ticket=${ticketId}&ticketNumber=${ticketNumber}${feedback}${waitTime}`
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
        {
          !isQueueValid
            ?
            <NoSuchQueue />
            :
            <>
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

                        {Array.isArray(categories) && categories.length > 0 && <>
                          <Text
                            pb="0.5rem"
                            textStyle="subtitle1"
                          >
                            {t('category')}
                          </Text>
                          <Select
                            name="category"
                            layerStyle="formSelect"
                            placeholder={t('select-category')}
                            required
                          >
                            {categories.map(category =>
                              <option value={category}>{category}</option>
                            )}
                          </Select>
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
                          marginTop="1.5rem"
                          type="submit"
                          isDisabled={registrationFields.length === 0}
                        >
                          {t('join-queue')}
                        </Button>

                        {privacyPolicyLink && <>
                          <Text pt="1rem" textStyle="body3">
                            <Text display="inline-block">{t('by-joining-this-queue-you-agree-to-our')}&nbsp;</Text>
                            <Text display="inline-block" textStyle="link">
                              <a href={privacyPolicyLink} target="_blank">{t('privacy-policy')}</a>
                            </Text>
                          </Text>
                        </>}
                      </Flex>
                    </form>
                  }
                </Box>
              </Flex>
            </>
        }
      </Main>
      <Footer />
    </Container>
  )
}
export default Index
