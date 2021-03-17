import {
  Box,
  Flex,
  Heading,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

import ManWithHourglass from "../../../src/assets/svg/man-with-hourglass.svg"

export const NoSuchQueue = () => {
  const { t, lang } = useTranslation('common')
  return <Box>
    <Flex
      direction="column"
      alignItems="center"
      >
      <ManWithHourglass
        className="featured-image"
      />
    </Flex>
    <Heading
      textAlign="center"
      textStyle="display2"
      mt="1em"
      >
      {t('no-such-queue')}
    </Heading>
  </Box>
}
