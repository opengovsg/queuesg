import {useMemo} from 'react'
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'

const Index = ({
  day,
  value,
  onChange,
  style
}) => {
  /**
   * `value` should be in the form of "08:00-20:00"
   */
  const startTime = useMemo(() => {
    return value ? value.split('-')[0] || "" : ""
  }, [value])
  const endTime = useMemo(() => {
    return value ? value.split('-')[1] || "" : ""
  }, [value])

  /**
   * Formats into "08:00-20:00"
   * 
   * @param {*} e 
   */
  const timeChanged = (e) => {
    let newOpeningHours = ''
    if (e.target.id === 'start') {
      newOpeningHours = `${e.target.value || ""}-${endTime ? endTime : ""}`
    } else {
      newOpeningHours = `${startTime || ""}-${e.target.value || ""}`
    }

    console.log(newOpeningHours)
    onChange(newOpeningHours)
  }

  return <Flex
    flexDirection="row"
    alignItems="start"
    justifyContent="start"
    {...style}
    >
    <Text width="25%" mr="5">{day}</Text>
    <Flex width="75%" flexDirection="column">
      <Flex flexDirection="row" alignItems="center" mb="5">
        <Input
          type="time"
          id="start"
          value={startTime}
          max={endTime}
          onChange={timeChanged}
          required={endTime !== ""}
          />
        <Text>&nbsp;to&nbsp;</Text>
        <Input
          type="time"
          id="end"
          value={endTime}
          min={startTime}
          onChange={timeChanged}
          required={startTime !== ""}
          />
      </Flex>
    </Flex>
  </Flex>
}

export default Index