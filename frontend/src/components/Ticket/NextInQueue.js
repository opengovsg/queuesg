import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  theme,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

import PeopleOnPhones from '../../assets/svg/people-on-phones.svg'

export const NextInQueue = ({
  leaveQueue,
  numberOfTicketsAhead,
  ticketId,
  queueId,
  waitingTime = 3,
}) => {
  const { t, lang } = useTranslation('common')

  return <>
    <Center>
      <PeopleOnPhones
        style={{ width: '360px', maxWidth: '100%' }}
      />
    </Center>
    <Box
      layerStyle="card"
      bgColor="base.500"
    >
      <Text
        textStyle="subtitle2"
      >
        {t('queue-position')}
      </Text>
      <Heading
        textStyle="display3"
        mb="2rem"
      >
        {t('youre-next')}
      </Heading>

      <Text
        textStyle="subtitle2"
      >
        {t('estimated-waiting-time')}
      </Text>
      <Heading
        textStyle="display3"
      >
        {waitingTime * numberOfTicketsAhead} {t('minutes')}
      </Heading>
    </Box>

    <Button
      bgColor="error.500"
      borderRadius="3px"
      isFullWidth={true}
      color="white"
      size="lg"
      variant="solid"
      marginTop="2rem"
      onClick={leaveQueue}
      disabled={!queueId || !ticketId}
    >
      {t('leave-the-queue')}
    </Button>
  </>
}
