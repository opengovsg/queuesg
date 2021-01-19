import { Stack } from '@chakra-ui/react'

export const Main = (props) => (
  <Stack
    w="100vw"
    h="calc(100vh - 96px)"
    justifyContent="space-evenly"
    {...props}
  />
)
