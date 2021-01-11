const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 4000;
const apiRoutes = require('./routes/api')


app.use(bodyParser.json());
app.use(
    cors({
        origin: 'http://localhost:3000/',
        credentials: true,
    })
)

app.use('/api', apiRoutes)

http.listen(PORT, () => {
    console.log(`Backend listening at http://localhost:${PORT}`);
});

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    socket.emit('connection', null);



    socket.on('channel-join', msg => {
        console.log('channel joined', msg);

    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
        // STATIC_CHANNELS.forEach(c => {
        //     let index = c.sockets.indexOf(socket.id);
        //     if (index != (-1)) {
        //         c.sockets.splice(index, 1);
        //         c.participants--;
        //         io.emit('channel', c);
        //     }
        // });
    });

});