const withPlugins = require('next-compose-plugins')
const withReactSvg = require('next-react-svg')
const path = require('path')
const nextTranslate = require('next-translate')

module.exports = withPlugins([
  [
    withReactSvg,
    {
      include: path.resolve(__dirname, 'src/assets/svg'),
      webpack(config, options) {
        return config
      }
    }
  ],
  [
    nextTranslate,
  ]
])