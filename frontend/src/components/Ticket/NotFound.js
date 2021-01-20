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

import NotFoundImg from '../../assets/svg/not-found.svg'

export const NotFound = () => {
  const { t } = useTranslation('common')

  return <>
    <Center>
      <Flex direction="column" >
        <NotFoundImg
          style={{ width: '360px', maxWidth: '100%' }}
        />
      </Flex>
    </Center>
    <Box>
      <Heading textStyle="display3" marginTop="2rem" textAlign="center">
        {t('the-queue-you-are-trying-does-not-exist')}
      </Heading>
      <Text textAlign="center" marginY="24px" textStyle="body1">
        {t('please-check-link')}
      </Text>
    </Box>
  </>
}
