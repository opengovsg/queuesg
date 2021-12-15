import {
  Box,
  Center,
  Text,
  Flex,
  Button,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

import LadyHoldingPhone from '../../assets/svg/lady-holding-phone.svg'

export const Served = ({ feedbackLink }) => {
  const { t } = useTranslation('common')

  return <>
    <Center>
      <Flex direction="column" >
        <LadyHoldingPhone
          className="featured-image"
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

      {feedbackLink &&
        <a href={feedbackLink}>
          <Button
            flex
            colorScheme="blue"
            borderRadius="3px"
            color="white"
            variant="solid"
            mt={4}
          >
            Give us some feedback
          </Button>
        </a>}
    </Box>
  </>
}
