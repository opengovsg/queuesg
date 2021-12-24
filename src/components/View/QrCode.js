import {
  Box,
  Text,
  Flex
} from '@chakra-ui/react'
import QRCode from 'qrcode.react'

export const QrCode = ({
  queuePendingUrl
}) => {
  return (
    <Flex
      layerStyle="card"
      width="100%"
      flexDirection="column">
      <Box margin="auto">
        <QRCode
          size={180}
          value={queuePendingUrl}
        />
      </Box>
      <Box mt={4}>
        <Text
          textStyle="heading2"
          color="primary.600"
          fontWeight="normal"
        >
         Scan the QR code to join the queue.
        </Text>
      </Box>
    </Flex>
  )
}
