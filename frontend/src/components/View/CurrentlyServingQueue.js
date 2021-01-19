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
    <Box
      mx={20}
      my={20}
      >
      <Box>
        <Heading
          textStyle="display1"
          mb="1em"
          >
            Currently serving
        </Heading>
        {
          (tickets.length > 0)
          ?
          (
            tickets.map(ticket => {
              return <Heading
                textStyle="display2"
                key={ticket.id}
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
  )
}
