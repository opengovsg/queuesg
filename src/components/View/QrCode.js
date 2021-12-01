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
          If you have missed your queue number, scan the QR code to rejoin.
        </Text>
      </Box>
    </Flex>
  )
}
