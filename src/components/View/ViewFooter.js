import {
  Center,
  Heading
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

export const ViewFooter = (props) => {
  const { t, lang } = useTranslation('common')
  return (
    <Center
      h="100%"
      >
      <Heading
        textStyle="display2"
        >
        {t('your-queue-number-may-not-be-called-in-sequence')}
      </Heading>
    </Center>
  )
}


