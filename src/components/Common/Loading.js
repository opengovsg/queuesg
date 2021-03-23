import {
  Center,
  Spinner,
  Text,
} from '@chakra-ui/react'

const Loading = ({
  text = "Loading..."
}) => {
  return <Center flexDir="column">
    <Spinner
      color="primary.500"
      thickness="4px"
      size="xl"
      />
    <Text
      textStyle="heading1"
      color="primary.500"
      pt="8"
      >
      {text}
    </Text>
  </Center>
}

export {
  Loading
}
