const Sauce = require('../models/Sauce');
const fs = require('fs');

//Méthode pour créer une sauce
exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    //supprime le id envoyé par le frontend
    delete sauceObject._id;
    //création d'un objet sauce suivant le model
    const sauce = new Sauce({
        ... sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    //sauvegarde de la sauce dans la base de donnée
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch((error) => res.status(400).json({error: error}));
};

//Méthode de lecture d'une sauce sélectionnée
exports.getOneSauce = (req, res, next) =>{
  Sauce.findOne({
      _id: req.params.id})
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({error: error}));
};

//Méthode de modification
exports.modifySauce = (req, res, next) =>{
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
   
          Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Objet modifié'}))
          .catch(error => res.status(400).json({error}));
  };

 
//Méthode de suppression
exports.deleteSauce = (req, res, next) =>{
  Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
      //Utilisation de l'ID comme paramètre pour accéder à la sauce
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        //Suppression de la sauce dans la base de données
        Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({error: error}))
        });
      })
    .catch(error => res.status(500).json({error}));
};

//Méthode de lecture de toutes les sauces
exports.getAllSauces = (req, res, next) => { 
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({error: error}));
};

//Méthode de création des données likes et dislikes pour alimenter le tableau
exports.reactToSauce = (req, res, next) => {  
    Sauce.findOne({_id: req.params.id})
    .then(sauce => { 
      switch (req.body.like) {   
          case 1 :
              if (!sauce.usersLiked.includes(req.body.userId)) {  
                Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
                .then(() => res.status(201).json({ message: 'Votre like a été ajouté !' }))
                .catch((error) => res.status(400).json({error: error}));
              } 
            break;
    
          case -1 :  
              if (!sauce.usersDisliked.includes(req.body.userId)) {  
                Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
            .then(() => res.status(201).json({ message: 'Votre désamour a été pris en compte !' }))
            .catch(error => res.status(400).json({ error }));
              } 
            break;
    
          case 0: 
              if (sauce.usersLiked.includes(req.body.userId)) { 
                Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}, _id: req.params.id})
                .then(() => res.status(201).json({ message: 'Votre like a été annulé !' })) 
                .catch(error => res.status(400).json({ error }));
              } else if (sauce.usersDisliked.includes(req.body.userId)) { 
                Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id})
                .then(() => res.status(201).json({ message: 'Votre désamour est annulé !' })) 
                .catch(error => res.status(400).json({ error })); 
              }   
            break;
          
          default: 
            throw { error: "Impossible d'agir sur vos likes, nous sommes désolés !" };
      }
    })
    .catch(error => res.status(400).json({ error }));
  };

