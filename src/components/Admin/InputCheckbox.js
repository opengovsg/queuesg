import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  VStack,
} from '@chakra-ui/react'

 const Index = ({
  id,
  label,
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
                console.log(option)
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
      </FormControl>
    </Flex>
  )
}

export default Index