// ==============
// puerto
// ==============

process.env.PORT = process.env.PORT || 3000;

// ==============
// Entorno
// ==============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============
// DB
// ==============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = 'mongodb+srv://iron_man:vEhMdk3Oou4eSe8Z@cluster0.3rldm.mongodb.net/cafe'
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;