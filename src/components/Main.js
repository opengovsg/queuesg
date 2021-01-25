import { Stack } from '@chakra-ui/react'

export const Main = (props) => (
  <Stack
    w="400px"
    maxW="100%"
    px={2}
    minHeight="calc(100vh - 84px)"
    justifyContent="space-evenly"
    {...props}
  />
)
