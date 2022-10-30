import {
  Box,
  Button,
  Center,
  Text,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

import PeopleOnPhones from '../../assets/svg/people-on-phones.svg'

export const InQueue = ({
  openLeaveModal,
  numberOfTicketsAhead,
  ticketId,
  queueId,
  waitingTime = 3,
}) => {
  const { t, lang } = useTranslation('common')

  return <>
    <Center>
      <PeopleOnPhones
        className="featured-image"
      />
    </Center>
    <Box
      layerStyle="card"
    >
      <Text
        textStyle="subtitle2"
      >
        {t('queue-position')}
      </Text>
      <Text
        textStyle="display3"
        mb="2rem"
      >
        {numberOfTicketsAhead} {t('ahead-of-you')}
      </Text>

      <Text
        textStyle="subtitle2"
      >
        {t('estimated-waiting-time')}
      </Text>
      <Text
        textStyle="display3"
      >
        {waitingTime * numberOfTicketsAhead} {t('minutes')}
      </Text>
    </Box>

    <Button
      bgColor="error.500"
      borderRadius="3px"
      width="100%"
      color="white"
      size="lg"
      variant="solid"
      marginTop="2rem"
      onClick={openLeaveModal}
      disabled={!queueId || !ticketId}
    >
      {t('leave-the-queue')}
    </Button>
  </>
}
