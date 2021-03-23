import {
  Flex,
  FormControl,
  FormLabel,
  Textarea
} from '@chakra-ui/react'

const Index = ({
  id,
  label,
  value,
  onChange,
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
        <Textarea value={value} onChange={onChange} />
      </FormControl>
    </Flex>
  )
}

export default Index