const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
//https://www.npmjs.com/package/express-bouncer
const bouncer = require('express-bouncer')(5000, 30000, 3);//Permet 3 essais ensuite interruption entre 5 secondes et 30 secondes
//empêche les attaques par force-brute 
bouncer.whitelist.push ("127.0.0.1");

router.post('/signup', userCtrl.signup); 
router.post('/login', bouncer.block, userCtrl.login); 


module.exports = router;