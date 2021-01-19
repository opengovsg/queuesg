import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react'
import QRCode from 'qrcode.react'

export const QrCode = ({
  queuePendingUrl
}) => {
  return (  
  <Grid
    layerStyle="card"
    w="100%"
    templateRows="repeat(1, 1fr)"
    templateColumns="repeat(4, 1fr)"
    gap={0}
  >
    <GridItem
      colSpan={1}
    >
      <QRCode
        value={queuePendingUrl}
      />
    </GridItem>
    <GridItem
      colSpan={3}
      alignSelf="center"
    >
      <Text
        textStyle="heading2"
        color="primary.600"
        >
        If you have missed your queue number, scan the QR code to rejoin.
      </Text>
    </GridItem>
  </Grid>
  )
}
