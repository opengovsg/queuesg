import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'

const Index = ({
  id,
  label,
  value,
  onChange,
  style
}) => {
  const daysOfTheWeek = {
    Monday: "1",
    Tuesday: "2",
    Wednesday: "3",
    Thursday: "4",
    Friday: "5",
    Saturday: "6",
    Sunday: "0",
  }

  return (
    <Flex
      pt="0.5rem"
      pb="0.5rem"
      {...style}
      >
      <FormControl id={id}>
        <FormLabel>{label}</FormLabel>
        {
          Object.keys(daysOfTheWeek).map(day => {
           return  <Flex alignItems="center" mb="3">
              <Text width="250px" mr="5">{day}</Text>
              <Input type="time" value={value} onChange={onChange} />
              <Text>&nbsp;to&nbsp;</Text>
              <Input type="time" value={value} onChange={onChange} />
            </Flex>
          })
        }
      </FormControl>
    </Flex>
  )
}

export default Index