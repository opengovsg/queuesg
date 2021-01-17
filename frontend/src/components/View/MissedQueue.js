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
      <Box textAlign="center">
        <Heading
          size="3xl"
          mb="1em"
          >
            Missed Queue
        </Heading>
        {
          (tickets.length > 0)
          ?
          (
            tickets.map(ticket => {
              return <Heading
                key={ticket.id}
                size="3xl"
                mb="0.5em"
                >
                  { getQueueNumber(ticket.name) }
              </Heading>
            })
          )
          :
          <Heading size="4xl">-</Heading>
        }
      </Box>
    </Center>
  )
}
