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
      flexDirection="column"
      padding={2}>
      <Box margin="auto">
        <QRCode
          size={160}
          value={queuePendingUrl}
        />
      </Box>
      <Box mt={2}>
        <Text
          textStyle="heading2"
          textAlign="center"
          fontSize="1.5rem"
          color="primary.600"
          fontWeight="normal"
        >
          Scan to join queue
        </Text>
      </Box>
    </Flex>
  )
}
