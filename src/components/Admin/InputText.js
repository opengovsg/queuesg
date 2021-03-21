import {
  Flex,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'

const Index = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  style
}) => {
  return (
    <Flex
      pt="0.5rem"
      pb="0.5rem"
      {...style}
      >
      <FormControl id={id}>
        <FormLabel>{label}</FormLabel>
        <Input type={type} value={value} onChange={onChange} />
      </FormControl>
    </Flex>
  )
}

export default Index