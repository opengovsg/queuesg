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
    mx={12}
    my={10}
    flexDirection='column'
    justifyContent='space-between'
    height="100%"
  >
    <Box>
      <Heading
        textStyle="display1"
        fontSize="5xl"
        mb="1em"
        textAlign="center"
      >
        Missed
      </Heading>
      <Flex flexWrap="wrap">
        {
          (tickets.length > 0)
            ?
            (
              tickets.map(ticket => {
                return (<>
                  <Heading
                    key={ticket.id}
                    textStyle="display1"
                    fontSize="5xl"
                    textAlign="center"
                    width="50%"
                    mb="0.5em"
                  >
                    {getQueueNumber(ticket.name)}
                  </Heading>
                </>)
              })
            )
            :
            <Heading
              textStyle="display2"
            >
              -
            </Heading>
        }
      </Flex>
    </Box>

    <QrCode
      queuePendingUrl={queuePendingUrl}
    />
  </Flex>
}
