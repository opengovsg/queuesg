import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  theme,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,

} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'


export function LeaveModal({ isOpen, onOpen, onClose, leaveQueue }) {
  const { t, lang } = useTranslation('common')
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent
        marginY={0}
        borderRadius={0}
        alignItems="center"
      >
        <ModalCloseButton />
        <ModalBody
          width="360px"
          maxW="100%"
          >
          <Heading textStyle="display3" marginTop="3rem" marginBottom="0.75rem">
            {t('are-you-sure-you-want-to-leave')}
          </Heading>
          <Text textStyle="body1">{t('you-will-need-to-scan-again')}</Text>
          <Flex direction="column" marginTop="2rem">
            <Button
              bgColor="error.500"
              borderRadius="3px"
              isFullWidth={true}
              color="white"
              size="lg"
              variant="solid"
              marginTop="0.5rem"
              onClick={leaveQueue}
            >
              {t('yes-leave-the-queue')}
            </Button>
            <Button
              borderRadius="3px"
              isFullWidth={true}
              color="primary.600"
              size="lg"
              variant="ghost"
              marginTop="0.5rem"
              onClick={onClose}
            >
              {t('no-dont-leave')}
            </Button>
          </Flex>
        </ModalBody>


      </ModalContent>
    </Modal>
  )
}
