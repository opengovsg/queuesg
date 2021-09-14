import {
  Box,
  Center,
  Heading,
} from '@chakra-ui/react'
import { getQueueName, getQueueNumber } from '../../utils'

export const CurrentlyServingQueue = ({
  listsOfTickets = {},
  lists = {}
}) => {
  return (
    <Box
      mx={20}
      my={10}
      >
      <Box>
        <Heading
          textStyle="display1"
          mb="0.5em"
          >
            Currently serving
        </Heading>
        {
          (Object.keys(listsOfTickets).length > 0)
          ?
          (
            Object.keys(listsOfTickets).map(listId => {
              const list = lists[listId]
              const queueName = getQueueName(list.name)
              
              const listElement = []
              if (queueName.length > 0 && listsOfTickets[listId].length > 0) {
                listElement.push(
                  <Heading
                    textStyle="heading2"
                    mt="1.25em"
                    mb="0.25em"
                  >
                    { queueName }
                  </Heading>
                )
              }

              listsOfTickets[listId].map(ticket => {
                listElement.push(<Heading
                  textStyle="display2"
                  key={ticket.id}
                  mb="0.05em"
                  mr="2em"
                  display="inline-block"
                  >
                { getQueueNumber(ticket.name) }
                </Heading>
                )
              })

              return listElement
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
