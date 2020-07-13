const jwt = require('jsonwebtoken');


// =============
// verificar token
// ==============

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    //res.json({
    //    token: token
    //});
    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token NO válido'
                }
            });
        }
        // para acceder al usuario que tiene ese token
        req.usuario = decoded.usuario;

        next();


    });



};



// =============
// verificar ADMIN_ROLE
// ==============

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role == 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }

}

// =============
// verificar Token de imagen
// ==============

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;


    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token NO válido'
                }
            });
        }
        // para acceder al usuario que tiene ese token
        req.usuario = decoded.usuario;

        next();


    });


}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}