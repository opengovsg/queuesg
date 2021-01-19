import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  theme,
  Flex
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

import AlarmClock from '../../assets/svg/alarm-clock.svg'

export const Served = ({ }) => {
  const { t } = useTranslation('common')

  return <>
    <Center>
      <Flex direction="column" >
        <AlarmClock
          style={{ width: '360px', maxWidth: '100%' }}
        />
      </Flex>

    </Center>
    <Box
      layerStyle="card"
    >
      <Text
        marginY="24px"
        textStyle="body1"
      >
        {t('thanks-for-coming')}
      </Text>
    </Box>
  </>
}
