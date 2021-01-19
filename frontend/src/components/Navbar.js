import { Box, Text, Flex, Button, Heading } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import i18nConfig from '../../i18n.json'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'

export const NavBar = (props) => {
  const router = useRouter()
  const { t, lang } = useTranslation('common')

  const [menuVisible, setMenuVisible] = useState(false)

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w="100vw"
      p={8}
      bg="base.100"
      color={"white"}
      {...props}>
      <Box w="200px">
        <Heading
          textStyle="subtitle1"
          fontWeight="bold"
          color="accent.500"
        >
          queue.gov.sg
        </Heading>
      </Box>
      <Box
        display={"block"}
        flexBasis={"auto"}
      >
        <Button
          rightIcon={<ChevronDownIcon />}
          textColor="#636467" variant="link"
          onClick={() => setMenuVisible(!menuVisible)}
        >
          {t('lang')}
        </Button>
        {menuVisible && <Box
          position="absolute"
          backgroundColor="white"
          marginLeft="-80px"
          marginTop="12px"
          textColor="#48494B"
          borderWidth="1px"
          borderColor="#D2D3D6"
          borderRadius="5px"
          width="160px"
        >
          <Link href={`${router.asPath}`} locale={'en'} >
            <Text margin="16px" fontSize="16px" lineHeight="24px">English</Text>
          </Link>
          <Link href={`${router.asPath}`} locale={'cn'} >
            <Text margin="16px" fontSize="16px" lineHeight="24px">中文</Text></Link>
          <Link href={`${router.asPath}`} locale={'ms'} >
            <Text margin="16px" fontSize="16px" lineHeight="24px"> Bahasa Melayu</Text></Link>
          <Link href={`${router.asPath}`} locale={'ta'} >
            <Text margin="16px" fontSize="16px" lineHeight="24px"> தமிழ்</Text></Link>

        </Box>}
      </Box>

    </Flex>
  )
}


