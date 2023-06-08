require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const https = require('https');
const fs = require('fs');
const initModel = require('./models/initModels');
const { Server } = require('socket.io');
const Sockets = require('./sockets');
const path = require('path');


//LA AUTENTICACIÓN CON LA BASE DE DATOS
db.authenticate()
  .then(() => console.log('Database Authenticated! 😼'))
  .catch((error) => console.log(error));

initModel();

//LA SINCRONIZACIÓN CON LA BASE DE DATOS
db.sync()
  .then(() => console.log('Database Synced! 🤩'))
  .catch((error) => console.log(error));


const port = +process.env.HTTP_PORT || 3443;

const sslServer=https.createServer({
  key:fs.readFileSync(path.join(__dirname,'cern','key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'cern','cert.pem'))
},app)

sslServer.listen(port, () => {
  console.log(`App running on port ${port}...`);
});



