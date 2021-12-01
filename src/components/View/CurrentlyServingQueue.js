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
      <Flex justifyContent="center">
        <Heading
          textStyle="display1"
          fontSize="5xl"
          mb="0.5em"
        >
          Currently serving
        </Heading>
      </Flex>

      {listIds.length === 0 && <Heading
        textStyle="display2"
      >
        -
      </Heading>}

      {listIds.map(listId => {
        const list = lists[listId]
        const queueName = getQueueName(list.name)

        if (queueName.length > 0 && listsOfTickets[listId].length > 0) {
          return (
            <>
              <Flex
                mt="1.25em"
                mb="0.25em"
                px="0.25em"
                justifyContent="space-around">
                <Heading textStyle="heading2" fontSize="5xl">
                  {queueName}
                </Heading>
                <Heading textStyle="heading2" fontSize="5xl">
                  {getQueueNumber(listsOfTickets[listId][0].name)}
                </Heading>
              </Flex>
            </>
          )
        }
        return <></>
      })
      }
    </Box>
  )
}
