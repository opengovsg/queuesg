import {
  Box,
  Center,
  Heading,
} from '@chakra-ui/react'

import { getQueueNumber } from '../../utils'

export const MissedQueue = ({
  tickets = []
}) => {
  return (
    <Center h="100%">
      <Box>
        <Heading
          textStyle="display1"
          mb="1em"
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
    </Center>
  )
}
