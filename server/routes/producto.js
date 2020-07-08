const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
const producto = require('../models/producto');


// Obtener producto
app.get('/producto', verificaToken, (req, res) => {
    // Trae todos los productos
    // poblando usuario y categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde); //convertirlo en numero

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, usuariosDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos: usuariosDB,
                    cuantos: conteo
                });
            });
        });

});


// Obtener producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    // Trae producto por id
    // poblando usuario y categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID del producto NO existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });



        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');


});

// -------------------
// Buscar productos
// -------------------

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // --i - insensible a mayusculas y minusculas
    //Producto.find({ nombre: termino }) -- para terminos exactos
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                produto: productoDB
            });



        });

});



// agregar producto
app.post('/producto', verificaToken, (req, res) => {
    // Grabar producto
    // Grabar categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            produto: productoDB
        });
    });


});




// Actualizar producto
app.put('/producto/:id', verificaToken, (req, res) => {
    // Actualizar producto

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de producto NO existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });


});

// Boorar un producto
app.delete('/producto/:id', verificaToken, (req, res) => {
    // Borrar producto
    // Actualizando Disponible a false
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                res.status(500).json({
                    ok: false,
                    err: {
                        message: ' El ID de producto NO exite'
                    }
                });
            }

            productoDB.disponible = false;
            productoDB.save((err, productoBorrado) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    producto: productoBorrado
                });
            });







        });


});




module.exports = app;