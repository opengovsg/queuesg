const express = require('express')
const bodyParser = require('body-parser');
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 4000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const apiRoutes = require('../backend/routes/api')



app.prepare().then(() => {
  const server = express()
  const http = require('http').createServer(server);
  const io = require('socket.io')(http);

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

  io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    socket.emit('connection', null);

    // socket.on('send-message', message => {
    //   io.emit('message', message);
    // });

    socket.on('disconnect', () => {

    });

  });


})