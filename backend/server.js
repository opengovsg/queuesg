const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 4000;
const apiRoutes = require('./routes/api')
const { getTicketsInQueue } = require('./classes/helper');


app.use(bodyParser.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
)

// Set socket io to global var
global.io = io;
io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    // socket.emit('connection', null);

    // User has joined queue with their new ticket
    socket.on('queue-trigger-update', async data => {
        try {
            console.log('channel joined', data);
            const queueCode = data.queue

            //Get Latest Queue State from DB
            const tickets = await getTicketsInQueue(queueCode)
            //Push update via socket
            if (tickets) {
                io.emit(`queue-update-${queueCode}`, { tickets });
            }

        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});


app.use('/api', apiRoutes)

http.listen(PORT, () => {
    console.log(`Backend listening at http://localhost:${PORT}`);
});
