import {
  Flex,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import DayOpeningHours from './DayOpeningHours'

const Index = ({
  id,
  label,
  value,
  onChange,
  style
}) => {

  const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]

  const dayOpeningHoursChanged = (dayNumber, dayOpeningHours) => {
    onChange({
      ...value,
      [dayNumber]: dayOpeningHours
    })
  }

  return (
    <Flex
      pt="0.5rem"
      pb="0.5rem"
      {...style}
      >
      <FormControl>
        <FormLabel>{label}</FormLabel>
        {
          daysOfTheWeek.map((day, dayNumber) => {
           return <DayOpeningHours
            key={dayNumber}
            day={day}
            value={value ? value[dayNumber] : ""}
            onChange={(dayOpeningHours) => dayOpeningHoursChanged(dayNumber, dayOpeningHours)}
           />
          })
        }
      </FormControl>
    </Flex>
  )
}

export default Index