import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = {
  body: `'Inter', sans-serif`,
  heading: `'Inter', sans-serif`,
  mono: `'Menlo', monospace`
}

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const layerStyles = extendTheme({
  card: {
    boxShadow: '0px 0px 10px rgba(216, 222, 235, 0.5)',
    borderRadius: '20px',
    backgroundColor: 'white',
    padding: '1.5rem',
    width: "350px",
    maxWidth: '100%',
  },
  formInput: {
    width: '100%',
    borderRadius: '3px',
    border: '1px solid #D2D3D6',
    marginBottom: '1rem',
  }
})

const textStyles = extendTheme({
  display1: {
    fontSize: ['3.5rem'],
    lineHeight: ['4rem'],
    fontWeight: 'bold',
    letterSpacing: '-0.022rem',
    color: 'primary.600',
  },
  display2: {
    fontSize: ['2.5rem'],
    lineHeight: ['3.5rem'],
    fontWeight: 'semibold',
    letterSpacing: '-0.022rem',
    color: 'primary.600',
  },
  display3: {
    fontSize: ['1.5rem'],
    lineHeight: ['2rem'],
    fontWeight: 'semibold',
    letterSpacing: '0.019rem',
    color: 'primary.600',
  },
  heading1: {
    fontSize: ['1rem', '1.5rem'],
    lineHeight: ['1.5rem', '2rem'],
    fontWeight: ['semibold', 'bold'],
    letterSpacing: ['0.08rem', '0.1rem'],
    color: 'primary.600',
  },
  heading2: {
    fontSize: ['1.75rem'],
    lineHeight: ['2rem'],
    fontWeight: ['bold'],
    letterSpacing: ['-0.014rem'],
    color: 'primary.600',
  },
  subtitle1: {
    fontSize: ['1rem'],
    lineHeight: ['1.5rem'],
    fontWeight: ['semibold'],
    letterSpacing: ['-0.011rem'],
    color: 'primary.600',
  },
  body1: {
    fontSize: ['1rem'],
    lineHeight: ['1.5rem'],
    letterSpacing: ['-0.011rem'],
    color: 'primary.600',
  },
  body2: {
    fontSize: ['0.875rem'],
    lineHeight: ['1.5rem'],
    letterSpacing: ['-0.006rem'],
    color: 'primary.600',
  },
  body3: {
    fontSize: ['0.8125rem'],
    lineHeight: ['1rem'],
    letterSpacing: ['-0.025rem'],
    color: 'primary.600',
  },
})

const theme = extendTheme({
  colors: {
    base: '#FEFBF8',
    black: '#16161D',
    accent: {
      500: '#FA9579'
    },
    primary: {
      500: '#82648F',
      600: '#454367',
    },
    secondary: {
      300: '#B4DAD7',
      400: '#94D3CF',
      500: '#7FC0BC',
      600: '#4DA59E',
    },
    error: {
      100: '#FFF8F8',
      300: '#E8C1C1',
      500: '#C05050',
      600: '#AD4848'
    },
    gray: {
      100: '#FBFCFD',
      200: '#F0F0F1',
      300: '#E1E2E4',
      400: '#D2D3D6',
      500: '#ABADB2',
      600: '#999B9F',
      700: '#636467',
      800: '#48494B',
    }
  },
  fonts,
  breakpoints,
  icons: {
    logo: {
      path: (
        <svg
          width="3000"
          height="3163"
          viewBox="0 0 3000 3163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="3000" height="3162.95" fill="none" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: '0 0 3000 3163',
    },
  },
  textStyles,
  layerStyles,
})

export default theme
