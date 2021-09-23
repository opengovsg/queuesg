import { Box, Flex, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import LogoQueue from '../assets/svg/logo-queue.svg'
import useTranslation from 'next-translate/useTranslation'

export const NavBar = (props) => {
  const router = useRouter()

  const { t, lang } = useTranslation('common')


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
      maxW="100%"
      width="400px"
      pt={4}
      pb={8}
      px={4}
      bg="base.100"
      color={"white"}
      {...props}>
      <Box>
        <a href="/">
          <LogoQueue
            height="40px"
            width="40px"
          />
        </a>
      </Box>
      <Box>
        {languages.map((lng, idx) => (
          <>
            {idx > 0 && <span style={{ color: "#636467" }} >|</span>}
            <Link
              key={lng.name}
              href={`${router.asPath}`}
              locale={lng.locale}
            >
              <Button textColor="#636467" variant="link" mx={1} fontSize='14px' textDecoration={t('lang') === lng.name ? 'underline' : 'none'}>
                {lng.name}
              </Button>
            </Link>
          </>
        ))}
      </Box>
    </Flex >
  )
}


