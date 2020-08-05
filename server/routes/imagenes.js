const express = require('express');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');


const fs = require('fs');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;




    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {

        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

        // una opcion con funcion proxima a ser obsoleta
        //res.sendfile('./server/assets/no-image.jpg');

        // Con path absoluto
        res.sendfile(noImagePath);
    }




});

module.exports = app;