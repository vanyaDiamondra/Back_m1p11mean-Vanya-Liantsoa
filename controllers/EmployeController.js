const UtilisateurModel = require("../models/UtilisateurModel");
const Token = require("../models/Token");
const {secretKey,base_url} = require("../db/TokenKey");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const creer = async (req, res, next) => {
    try {
      
      const {nom,prenom,contact,email,sexe,date_naissance,mdp} = req.body;
  
      //Vérification champ vide
      if (!nom || !prenom|| !contact || !sexe || !mdp || !email) {
        return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
      }
  
      // Vérification date
      const today = new Date();
      const dateNaissance = new Date(date_naissance);
      if (dateNaissance >= today) {
        return res.status(400).json({ message: 'Date de naissance invalide' });
      }
  
      //Vérification si mail déjà existance
      const user = await UtilisateurModel.findOne({ email });
          if (!user)
              return res.status(401).send({ message: "Email déjà existante" });
  
      //enregistrement
      const mdphashe = await bcrypt.hash(mdp, 10);
      const utilisateur = new UtilisateurModel({ nom,prenom,contact,email,sexe,date_naissance,mdp:mdphashe,type:2,photo:""});
      await utilisateur.save();
      return res.status(201).json({ message: 'Utilisateur bien enregistrer' });
  
  
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const supprimer = async (req, res, next) => {
    try{
        const empid = req.params.id;
        const deletedDocument = await UtilisateurModel.findByIdAndDelete(empid);
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Employé non existante' });
        }
        res.json({ message: 'Employé bien supprimé', deletedDocument });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
      }
    
  }

  const modifier = async (req, res, next) => {
    try {
      
        const {nom,prenom,contact,email,sexe,date_naissance,mdp} = req.body;
    
        //Vérification champ vide
        if (!nom || !prenom|| !contact || !sexe || !mdp || !email) {
          return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
        }
    
        // Vérification date
        const today = new Date();
        const dateNaissance = new Date(date_naissance);
        if (dateNaissance >= today) {
          return res.status(400).json({ message: 'Date de naissance invalide' });
        }
    
        //Vérification si mail déjà existance
        const user = await UtilisateurModel.findOne({ email });
            if (!user)
                return res.status(401).send({ message: "Email déjà existante" });
    
        //enregistrement
        const mdphashe = await bcrypt.hash(mdp, 10);
        const updatedDocument = await UtilisateurModel.findByIdAndUpdate(userId.userId, { nom: nom,prenom: prenom,contact: contact,email: email,sexe: sexe,date_naissance: date_naissance,mdp: mdphashe }, { new: true });
        await utilisateur.save();
        return res.status(201).json({ message: 'Utilisateur bien enregistrer' });

      } catch (error) {
        res.status(500).json({ message: error.message });
      }

  }

  const rechercher = async (req, res, next) => {

  }
  const getall = async (req, res, next) =>{
    try{
      const details=await UtilisateurModel.find({type:2});
      return res.json(details);
    }catch (error) {
      console.error('Error setting up notification stream:', error);
    }
  }
  module.exports = {creer,supprimer,modifier,rechercher,getall}