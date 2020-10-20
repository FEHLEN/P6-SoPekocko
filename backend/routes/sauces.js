const express = require('express');
//Utilisation de la fonction routeur de express
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
//Module qui gère les fichiers entrants, dans cette API les images
const multer = require('../middleware/multer-config');


//Les routes CRUD avec la fonction auth pour la gestion du token
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce); 
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);   
router.post('/:id/like', auth, sauceCtrl.reactToSauce);

module.exports = router;
