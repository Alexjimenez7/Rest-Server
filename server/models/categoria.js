const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaScchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la  Categoría es necesaria']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

});


categoriaScchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports =
    mongoose.model('Categoria', categoriaScchema);