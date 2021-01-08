const express = require('express')
const bodyParser = require('body-parser');
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 4000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const apiRoutes = require('./backend/routes/api')

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json());
  server.use('/api', apiRoutes)

  // Next.js catch all for routes
  server.all('*', (req, res) => {
    return handle(req, res)
  })


  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})