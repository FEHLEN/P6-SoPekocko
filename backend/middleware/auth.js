const jwt = require('jsonwebtoken'); 
//Le module jsonwebtoken permet de créer un token

//Middelware qui vérifie le token de l'utilisateur
module.exports = (req, res, next) => {
  try { 
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
       throw 'User ID non valable !';
    } else {  
       next();
    }
  } catch (error) {
    res.status(401).json({error: error | 'Requête non authentifiée !'});
  }
};