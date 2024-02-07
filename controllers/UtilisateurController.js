const UtilisateurModel = require("../models/UtilisateurModel");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUtilisateur = async (req, res, next) => {
  try {
    const utilisateurs = await UtilisateurModel.find();
    res.json(utilisateurs);
  } catch (err) {
    throw err.message;
  }
};

const inscription= async (req, res, next) => {
  try {
    const {nom,prenom,contact,email,sexe,date_naissance,mdp} = req.body;

    //Vérification champ vide
    if (!nom || !prenom|| !contact || !sexe || !mdp || !email) {
      return res.status(400).json({ error: 'Le remplissage de tous les champs est requis' });
    }

    // Vérification date
    const today = new Date();
    const dateNaissance = new Date(date_naissance);
    if (dateNaissance >= today) {
      return res.status(400).json({ error: 'Date de naissance invalide' });
    }

    

    //enregistrement
    const mdphashe = await bcrypt.hash(mdp, 10);
    const utilisateur = new UtilisateurModel({ nom,prenom,contact,email,sexe,date_naissance,mdp:mdphashe,type:1,photo:""});
    await utilisateur.save();
    res.status(201).json({ message: 'Utilisateur bien enregistrer' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login= async (req, res, next) => {
  try {
    const { email, mdp } = req.body;
    const utilisateur = await UtilisateurModel.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({ error: 'email invalide' });
    }
    const mdpValide = await bcrypt.compare(mdp, utilisateur.mdp);
    if (!mdpValide) {
      return res.status(401).json({ error: 'mot de passe invalide' });
    }
    const token = jwt.sign({ userId: utilisateur._id }, 'salon', { expiresIn: 86400 });
    res.status(200).json({ utilisateur: utilisateur, token: token });    
    //res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
  
};

const verification = async(req, res, next) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Aucun token' });
  }
 

  jwt.verify(token, 'salon' , (err, decoded) => {
    if(err){
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirée '+token });
      } 
      else {
        return res.status(401).json({ error: 'Token non valide' });
      }
    }
    else{
      //req.userId = decoded.userId;
      res.status(200).json({ tokenFromDb });
      next();
    }
    

   
  });
}





module.exports = { getUtilisateur, inscription,login };