import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Spinner,
  useEditableControls,
} from '@chakra-ui/react'
import {
  CheckIcon,
  CloseIcon,
  EditIcon,
} from '@chakra-ui/icons'

const Index = ({
  color = "",
  fontSize = "md",
  isLoading = false,
  textStyle = "",
  onSubmit = (nextValue) => {},
  value = "",
}) => {
  const EditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    if (isLoading) {
      return <Spinner
          ml="5"
        />
    } else if (isEditing) {
      return <ButtonGroup 
        display="flex"
        ml="5"
        justifyContent="center"
        size="sm"
        >
        <IconButton
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
          />
        <IconButton
          icon={<CloseIcon />}
          {...getCancelButtonProps()}
          />
      </ButtonGroup>
    } else {
      return <Flex
        justifyContent="center"
        ml="5"
        >
        <IconButton icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    }
  }

  return (
    <Editable
      display="flex"
      flexDir="row"
      alignItems="center"
      defaultValue={value || ""}
      fontSize={fontSize}
      isPreviewFocusable={false}
      onSubmit={onSubmit}
    >
      <EditablePreview
        textStyle={textStyle}
        color={color}
        />
      <EditableInput
        textStyle={textStyle}
        color={color}
        px="2"
        />
      <EditableControls />
    </Editable>
  )
}

export default Index