require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
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
const server=app.listen(port, () => {
  console.log(`App Running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET, POST'],
  },
});

new Sockets(io)
