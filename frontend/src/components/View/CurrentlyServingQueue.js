import {
  Box,
  Center,
  Heading,
} from '@chakra-ui/react'
import { getQueueNumber } from '../../utils'

export const CurrentlyServingQueue = ({
  tickets = []
}) => {
  return (
    <Center h="100%">
      <Box textAlign="center">
        <Heading
          size="4xl"
          mb="1em"
          >
            Currently Serving
        </Heading>
        {
          (tickets.length > 0)
          ?
          (
            tickets.map(ticket => {
              return <Heading
                key={ticket.id}
                size="4xl"
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
