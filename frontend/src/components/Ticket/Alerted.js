import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  theme,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

import AlarmBell from '../../assets/svg/alarm-bell.svg'

export const Alerted = ({
  leaveQueue,
  ticketId,
  queueId,
  waitingTime = 3,
}) => {
  const { t, lang } = useTranslation('common')

  return <>
    <Center>
      <AlarmBell
        style={{ width: '360px', maxWidth: '100%' }}
      />
    </Center>
    <Box
      layerStyle="card"
      bgColor="secondary.600"
    >
      <Text
        textStyle="subtitle2"
        color="white"
      >
        {t('queue-position')}
      </Text>
      <Heading
        textStyle="display3"
        color="white"
        mb="2rem"
      >
        {t('its-your-turn')}
      </Heading>

      <Text
        textStyle="subtitle2"
        color="white"
      >
        {t('your-queue-number-will-be-held-for')}
      </Text>
      <Heading
        textStyle="display3"
        color="white"
      >
        {waitingTime} {t('minutes')}
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
