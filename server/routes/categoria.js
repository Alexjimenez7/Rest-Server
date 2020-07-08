const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


// Agregando 5 servicios

// Mostrar todas las Categorias
app.get('/categoria', verificaToken, (req, res) => {
    // Sin paginacion

    Categoria.find()
        .sort({ descripcion: -1 }) // 1 asc    -1 desc
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });

});



// Mostrar categoria por Id
app.get('/categoria/:id', verificaToken, (req, res) => {

    //Categoria.findById()

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.status(500).json({
                ok: false,
                err: {
                    message: ' El ID de la categoria NO es valido'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    }).populate('usuario', 'nombre email');

});

// Crear una categoria
app.post('/categoria', verificaToken, (req, res) => {
    // Regresa la nueva categoria
    // tengo acceso a req.usuario._id de la persona
    // que ejecuto esto y agrego categoria

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Actualiza una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    // Regresa la nueva categoria actualizada
    // solo actualizar descripcion
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findOneAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
    }, (err, categoriaDB) => {


        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});


// Boorar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un admin puede borrar
    // debe pedir el token
    // borrar fisicamente el registro

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id NO existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Catgoría borrada',
            categoriaBorrada
        });


    });


});







module.exports = app;