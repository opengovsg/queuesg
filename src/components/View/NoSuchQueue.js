import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import useTranslation from 'next-translate/useTranslation'
import NotFound from '../../assets/svg/not-found.svg'

export const NoSuchQueue = () => {
  const { t, lang } = useTranslation('common')
  const goBack = () => {
    window.history.back()
  }
  
  return <Flex
    h="calc(100vh - 72px - 215px)"
    flexDirection="column"
    justifyContent="center"
    >
    <Center
      flexDirection="column"
    >
      <Center>
        <NotFound
          className="featured-image"
        />
      </Center>
      <Box textAlign="center">
        <Heading textStyle="display3" my={4}>
          {t("we-cant-seem-to-find-the-page-you-are-looking-for")}
        </Heading>
        <Button
          bgColor="primary.500"
          color="white"
          leftIcon={<ArrowBackIcon />}
          onClick={goBack}
        >
          {t('go-back')}
        </Button>
      </Box>
    </Center>
  </Flex>
}
