import {
  Flex,
  Box,
  Heading,
} from '@chakra-ui/react'
import { QrCode } from './QrCode'
import { getQueueNumber } from '../../utils'

export const MissedQueue = ({
  tickets = [],
  queuePendingUrl,
}) => {
  return <Flex
    mx={20}
    my={10}
    flexDirection='column'
    justifyContent='space-between'
    height="100%"
  >
    <Box
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
                  {getQueueNumber(ticket.name)}
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
    <Box >
      <QrCode
        queuePendingUrl={queuePendingUrl}
      />
    </Box>
  </Flex>
}
