const multer = require('multer');  

const MIME_TYPES = {  
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};
// fonction qui utilise multer pour enregistrer l'image dans le répertoire image du diskStorage avec une nouvelle nomination
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];  
        callback(null, name + Date.now() + '.' + extension); 
    }
});

module.exports = multer({storage}).single('image');  
