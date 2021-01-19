import { Flex } from '@chakra-ui/react'

export const Container = (props) => {
  return (
    <Flex
      minHeight="100vh"
      direction="column"
      justifyContent="start"
      alignItems="center"
    >
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        direction="column"
        bg="base.100"
        color='primary.600'
        {...props}
      />
    </Flex>

  )
}
