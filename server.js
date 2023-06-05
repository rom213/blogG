require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const http = require('http');
const initModel = require('./models/initModels');
const { Server } = require('socket.io');
const Sockets = require('./sockets');


//LA AUTENTICACIÓN CON LA BASE DE DATOS
db.authenticate()
  .then(() => console.log('Database Authenticated! 😼'))
  .catch((error) => console.log(error));

initModel();

//LA SINCRONIZACIÓN CON LA BASE DE DATOS
db.sync()
  .then(() => console.log('Database Synced! 🤩'))
  .catch((error) => console.log(error));

const port = +process.env.PORT || 3200;

const serverHttp = http.createServer(app);
serverHttp.listen(process.env.HTTP_PORT, process.env.IP);
serverHttp.on('listening', () => console.info(`Notes App running at http://${process.env.IP}:${process.env.HTTP_PORT}`));

const io = new Server(serverHttp, {
  cors: {
    origin: '*',
    methods: ['GET, POST'],
  },
});

new Sockets(io)
