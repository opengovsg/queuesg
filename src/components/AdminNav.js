import { Box, Text, Flex, Stack, Link } from '@chakra-ui/react'


export const AdminNav = (props) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w="100%"
      mb={8}
      p={8}
      bg={"primary.500"}
      color={"white"}
      {...props}>
      <Box w="100px">
        <Text fontSize="lg" fontWeight="bold" color="black">QueueSG</Text>
      </Box>
      <Box
        display={{ base: "block", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={8}
          align="center"
          justify={["flex-end"]}
          direction={["row"]}
          pt={[4, 4, 0, 0]}
          color="black"
        >
          <Link href={`/admin/setup?queue=${props.queue}`}>
            <Text display="block" >
              Setup
          </Text>
          </Link>
          <Link href={`/admin/manage?queue=${props.queue}`}>
            <Text display="block" >
              Manage Queue
          </Text>
          </Link>
        </Stack>
      </Box>
    </Flex>
  )
}


