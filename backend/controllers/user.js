const bcrypt = require('bcrypt'); //Permet de chiffrer le mot de passe utilisateur
//sous forme de hash par chiffrement
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Mot de passe
exports.signup = (req, res, next) =>{  
    //Hachage de Bcrypt et demande de saler 10 fois (plus de fois rallentirait l'exécution)
    bcrypt.hash(req.body.password, 10) 
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() => res.status(201).json ({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error: error}));
            })
        .catch(error => res.status(500).json({ error }));
};
//Adresse mail
exports.login = (req, res) =>{
    User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {  
            return res.status(401).json({ error: 'Utilisateur non trouvé !'})
        }
        bcrypt.compare(req.body.password, user.password)  
            .then(valid => {
                if (!valid) { 
                    return res.status(401).json({ error: 'Erreur mot de passe !'})
                }
                res.status(200).json({  
                    userId: user._id,
                    token: jwt.sign( 
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        //Durée de validité du token 24 heures
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

