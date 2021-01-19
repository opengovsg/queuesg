import { Box, Center, Grid, GridItem, Text, Flex, Stack, IconButton, Button } from '@chakra-ui/react'

export const ViewHeader = ({ board }) => {
  return (
    <Grid
      w="100%"
      h="100%"
      bg="base"
      templateColumns="repeat(6, 1fr)"
      >
      <GridItem
        colSpan="3"
        >
        <Flex
          h="100%"
          alignContent="center"
          mx="6"
          >
          <Center>
            <Text fontSize="lg" fontWeight="bold" color="primary.500">QueueSG</Text>
          </Center>
        </Flex>
      </GridItem>
      <GridItem
        colSpan="3"
        >
        <Flex
          h="100%"
          alignContent="center"
          justifyContent="flex-end"
          mx="6"
          >
          <Center>
            <Text
              textStyle="heading1"
              >
              { board ? board.name : '-' }
            </Text>
          </Center>
        </Flex>
      </GridItem>
    </Grid>
  )
}


