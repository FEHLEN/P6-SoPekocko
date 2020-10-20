const passwordSchema = require('../models/Password');


//Vérifier que le mot de passe valide le schema donné pour s'assurer 
//que l'utilisateur est un mot de passe fort
module.exports = (req, res, next) => 
{      
    if(!passwordSchema.validate(req.body.password)) 
    {
        return res.status(400).json({error: 'Mot de passe pas assez fort ! ' + passwordSchema.validate(req.body.password, {list:true})});
    }
    else
    {
        next();
    }
};