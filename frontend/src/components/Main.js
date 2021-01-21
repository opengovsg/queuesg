import { Stack } from '@chakra-ui/react'

export const Main = (props) => (
  <Stack
    w="360px"
    minHeight="calc(100vh - 48px)"
    justifyContent="space-evenly"
    {...props}
  />
)
