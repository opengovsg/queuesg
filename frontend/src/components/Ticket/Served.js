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

import LadyHoldingPhone from '../../assets/svg/lady-holding-phone.svg'

export const Served = ({ }) => {
  const { t } = useTranslation('common')

  return <>
    <Center>
      <Flex direction="column" >
        <LadyHoldingPhone
          style={{ width: '360px', maxWidth: '100%' }}
        />
      </Flex>

    </Center>
    <Box
      layerStyle="card"
      textAlign="center"
      mt={3}
    >
      <Text
        textStyle="display3"
        mb={4}
      >
        {t('thanks-for-coming')}
      </Text>
      <Text
        textStyle="body1"
      >
        {t('wish-you-good-day-ahead')}
      </Text>
    </Box>
  </>
}
