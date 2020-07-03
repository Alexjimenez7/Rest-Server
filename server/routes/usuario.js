const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    //res.json('get usuario...');

    // despues de haber llamado a verificaToken
    // puedo acceder al usuario

    /* return res.json({
         usuario: req.usuario,
         nombre: req.usuario.nombre,
         email: req.usuario.email
     });
     */

    // Proceso para hacer paginacion e indicacion desde
    // el registro que se desea consultar

    let desde = req.query.desde || 0;
    desde = Number(desde); //convertirlo en numero

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // la lista de campos en find es opcional para filtrar algunos campos
    // se agrego {estado: true} -- aunque es opcional para filtrar registros
    // de igual forma en count
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });




        });
});



// ayuda paquete body-parser
// npm i body-parser --save
app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        // para omitir password en retorno
        //usuarioDB.password = null;

        res.json({
            ok: true,
            body,
            usuario: usuarioDB
        });

    });


});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let myid = req.params.id;
    //let body = req.body;
    let campos_validos = ['nombre', 'email', 'img', 'role', 'estado'];
    let body = _.pick(req.body, campos_validos);

    //body.password = bcrypt.hashSync(body.password, 10);
    // podriamos evitar que el usuario nos modifique
    // campos que no queremos actualizar en la DB
    // sin embargo no es muy eficiente cuando son muchos campos
    // podemos usar la libreria undescore.js -- underscorejs.org
    //delete body.password;
    //delete body.google;

    Usuario.findByIdAndUpdate(myid, body, {
        new: true,
        runValidators: true,
        context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
    }, (err, usuarioDB) => {
        //usuarioDB.save
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    /*Usuario.findById(myid, body, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //  usuarioDB.nombre = "CESAR KEMPER";
        //usuarioDB.set('nombre', body.nombre);
        //usuarioDB.set('email', body.email);
        //usuarioDB.set('role', body.role);
        //usuarioDB.set('google', body.google);
        //usuarioDB.set('estado', body.estado);
        //usuarioDB.save();
        res.json({
            ok: true,
            body: body

        });
    });
    */






})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    // para borrar el registro de la DB:
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    // Cambiando unicamente el estado del registro
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario NO encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

    //res.json('delete usuario');
});

module.exports = app;