import {
  Box,
  Center,
  Heading,
} from '@chakra-ui/react'
import { QrCode } from './QrCode'
import { getQueueNumber } from '../../utils'

export const MissedQueue = ({
  tickets = [],
  queuePendingUrl,
}) => {
  return <>
    <Box
      mx={20}
      my={10}
      >
      <Box>
        <Heading
          textStyle="display1"
          mb="0.5em"
          >
            Missed queue
        </Heading>
        {
          (tickets.length > 0)
          ?
          (
            tickets.map(ticket => {
              return <Heading
                key={ticket.id}
                textStyle="display2"
                mb="0.5em"
                >
                { getQueueNumber(ticket.name) }
              </Heading>
            })
          )
          :
          <Heading
            textStyle="display2"
            >
            -
          </Heading>
        }
      </Box>
    </Box>
    <Box
      mx={20}
      my={20}
      >
      <QrCode
        queuePendingUrl={queuePendingUrl}
        />
    </Box>
  </>
}
