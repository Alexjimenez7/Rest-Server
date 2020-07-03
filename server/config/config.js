// ==============
// puerto
// ==============

process.env.PORT = process.env.PORT || 3000;

// ==============
// Entorno
// ==============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// =====================
// Vencimiento del token
// =====================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

// =====================
// Seed de autenticación
// =====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==============
// DB
// ==============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}


// ==============
// Google Client ID
// ==============

process.env.CLIENT_ID = process.env.CLIENT_ID || '1076732845303-v517hb5d07732ucph4sqp9rmlk85s6li.apps.googleusercontent.com';


process.env.URLDB = urlDB;