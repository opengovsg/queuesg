import { Stack } from '@chakra-ui/react'

export const Main = (props) => (
  <Stack
    w="360px"
    h="calc(100vh - 96px)"
    justifyContent="space-evenly"
    {...props}
  />
)
