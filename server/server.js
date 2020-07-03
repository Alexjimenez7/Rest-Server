require('./config/config');

const express = require('express');
const app = express();

// Using Node.js `require()`
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Configuracion global de rutas
app.use(require('./routes/index'));



app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});

// Conexion a MONGODB
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw new err;

        console.log(`Base de datos ONLINE`);
    });