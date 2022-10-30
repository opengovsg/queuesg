const path = require('path')
const nextTranslate = require('next-translate')

const config = {
  webpack(config, _options) {
    config.module.rules.push({
      test: /\.(svg)$/,
      include: path.resolve(__dirname, 'src/assets/svg'),
      loader: 'svg-react-loader',
    })
    return config
  }
}

module.exports = nextTranslate(config)
