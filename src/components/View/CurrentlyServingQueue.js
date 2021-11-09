import {
  Box,
  Heading,
  Flex
} from '@chakra-ui/react'
import { getQueueName, getQueueNumber } from '../../utils'

export const CurrentlyServingQueue = ({
  listsOfTickets = {},
  lists = {}
}) => {
  const listIds = Object.keys(listsOfTickets)
  return (
    <Box
      mx={20}
      my={10}
    >

      <Heading
        textStyle="display1"
        mb="0.5em"
      >
        Currently serving
      </Heading>
      {listIds.length === 0 && <Heading
        textStyle="display2"
      >
        -
      </Heading>}
      <Flex flexWrap="wrap">
        {listIds.map(listId => {
          const list = lists[listId]
          const queueName = getQueueName(list.name)

          if (queueName.length > 0 && listsOfTickets[listId].length > 0) {
            return (
              <Heading
                textStyle="heading2"
                mt="1.25em"
                mb="0.25em"
                px="0.25em"
                width="50%"
              >
                {queueName} {' '}{getQueueNumber(listsOfTickets[listId][0].name)}
              </Heading>
            )
          }
          return <></>
        })
        }
      </Flex>
    </Box>
  )
}
