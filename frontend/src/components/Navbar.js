import { Box, Text, Flex, Button, Heading } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'

export const NavBar = (props) => {
  const router = useRouter()
  const { t, lang } = useTranslation('common')

  const [menuVisible, setMenuVisible] = useState(false)

  const languages = [
    {
      name: 'English',
      locale: 'en'
    },
    {
      name: '中文',
      locale: 'cn'
    },
    {
      name: 'Bahasa Melayu',
      locale: 'ms'
    },
    {
      name: 'தமிழ்',
      locale: 'ta'
    },
  ]

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w="360px"
      pt={4}
      pb={8}
      px={4}
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
          textColor="#636467"
          variant="link"
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
          {
            languages.map(language => (
              <Link
                key={language.name}
                href={`${router.asPath}`}
                locale={language.locale}
              >
                <Box
                  m={4}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setMenuVisible(false)}
                  >
                  <Text
                    fontSize="16px"
                    lineHeight="24px"
                  >
                    { language.name }
                  </Text>
                </Box>
              </Link>
            ))
          }
        </Box>}
      </Box>

    </Flex>
  )
}


