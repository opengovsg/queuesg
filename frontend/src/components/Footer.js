import { Box, Flex, Text } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

import LogoOgp from "../../src/assets/svg/logo-ogp.svg"

export const Footer = (props) => {
  const { t, lang } = useTranslation('common')

  return <Flex
    bgColor="primary.600"
    w="100vw"
    as="footer"
    justifyContent="center"
  >
    <Box
      color="white"
      maxWidth="360px"
      px={4}
      py={8}>
      <Text
        color="gray.500"
        textStyle="body2"
        mb={4}
      >
        {t('built-by')}
      </Text>
      <LogoOgp />
      <Text
        color="gray.500"
        textStyle="body2"
        mt={4}
      >
        {t('copyright')}
      </Text>
    </Box>

  </Flex>
}
