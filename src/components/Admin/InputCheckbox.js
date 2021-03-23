import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
} from '@chakra-ui/react'

 const Index = ({
  id,
  label,
  helperText,
  value,
  options = {},
  onChange,
  style
}) => {
  return (
    <Flex
      pt="0.5rem"
      pb="0.5rem"
      >
      <FormControl id={id}>
        <FormLabel>{label}</FormLabel>
        <CheckboxGroup
          colorScheme="primary"
          value={value}
          onChange={onChange}
          >
          <VStack
            alignItems="flex-start"
            >
            {
              Object.entries(options).map((option, index) => {
                return <Checkbox
                  key={index}
                  value={option[0]}
                  >
                  {option[1]}
                </Checkbox>
              })
            }
          </VStack>
        </CheckboxGroup>
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