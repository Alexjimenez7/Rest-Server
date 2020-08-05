const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son : ' + tiposValidos.join(', ')
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[1];
    // Extensiones permitidas
    let extensionesvalidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesvalidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones pemitidas son : ' + extensionesvalidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



        //res.json({
        //    ok: true,
        //    message: 'Archivo subido correctamente'
        //});

    });
});


function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {

            // borrando imagen asociada anterior (si existe)
            borraArchivo('productos', nombreArchivo);

            return res.status(500).join({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            if (err) {
                // borrando imagen asociada anterior (si existe)
                borraArchivo('productos', nombreArchivo);

                return res.status(400).join({
                    ok: false,
                    err: {
                        message: 'Producto NO existe'
                    }
                });
            }
        }

        // borrando imagen asociada anterior (si existe)
        borraArchivo('productos', productoDB.img);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).join({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo,
                message: 'Imagen de producto actualizada correctamente'
            });
        });

    });
}


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            // borrando imagen asociada anterior (si existe)
            borraArchivo('usuarios', nombreArchivo);

            return res.status(500).join({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            if (err) {
                // borrando imagen asociada anterior (si existe)
                borraArchivo('usuarios', nombreArchivo);

                return res.status(400).join({
                    ok: false,
                    err: {
                        message: 'Usuario NO existe'
                    }
                });
            }
        }

        // borrando imagen asociada anterior (si existe)
        borraArchivo('usuarios', usuarioDB.img);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).join({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo,
                message: 'Imagen de usuario actualizada correctamente'
            });
        });

    });

}

function borraArchivo(tipo, nombreImagen) {
    // borrando imagen asociada anterior (si existe)
    if (nombreImagen === '' || !nombreImagen) {
        return;
    }
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}





module.exports = app;