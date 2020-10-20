const express = require('express');
const bodyParser = require('body-parser');
//Mongoose impose pour une sécurité renforcée un modèle clé:valeur il facilite les interactions avec
//la base de données 
const mongoose = require('mongoose');
const path =require('path');
//https://expressjs.com/fr/advanced/best-practice-security.html
//Helmet vous aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant 
//de manière appropriée des en-têtes HTTP.
const helmet = require('helmet');

const session = require('cookie-session');

const sauceRoute = require('./routes/sauces'); 
const userRoute = require('./routes/user');

//Connection à la base MongoDb
//https://blog.impulsebyingeniance.io/gestion-de-la-securite-dans-mongodb/

mongoose.connect('mongodb+srv://lilife:H2o4r7u8sCr1@cluster0.zdosb.mongodb.net/test?retryWrites=true&w=majority',
//Accès new_user1:S4e7c23uRE avec seulement accès à cette base de donnée
{ useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouéé !'));

//Utilisation de express dans l'application
const app = express();

app.use(helmet()); //application de helmet dans l'API
//CORS donnant l'accès par un serveur différent
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//paramètre les cookies en http-only
app.use(session({
    secret: "Horus",
    cookie: { secure: true,
              httpOnly: true,
              domain: 'http://localhost:3000',
            }
    })
  );


//Utilisation du module bodyParser pour la gestion des données envoyées par le formulaire frontend
app.use(bodyParser.json());
//Middelware qui gère les images, enregistrées dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));
//Middleware qui transmet les requêtes avec les url définies
app.use('/api/sauces', sauceRoute); 
app.use('/api/auth', userRoute);   


module.exports = app;
