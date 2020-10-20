const mongoose = require('mongoose');
//Utilisation du module mongoose-unique-validator pour un email unique
const uniqueValidator = require('mongoose-unique-validator');

//Création d'un schéma mongoose stricte pour l'enregistrement sur la base de données
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

//Un email unique par possible d'utiliser deux fois le même email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
