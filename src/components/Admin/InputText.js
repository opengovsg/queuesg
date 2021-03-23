import {
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input
} from '@chakra-ui/react'

const Index = ({
  id,
  label,
  helperText,
  value,
  onChange,
  required = false,
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
        <Input type={type} required={required} value={value} onChange={onChange} />
        {
          helperText
          ?
          <FormHelperText>{helperText}</FormHelperText>
          :
          null
        }
      </FormControl>
    </Flex>
  )
}

export default Index