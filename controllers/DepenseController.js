const DepenseModel = require("../models/DepenseModel");
const Token = require("../models/Token");
const {secretKey,base_url} = require("../db/TokenKey");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DepenseCategorie = require("../models/CatDepense");


const creer = async (req, res, next) => {
  try {
    const {nom,prix,mois,annee,id_categorie} = req.body;  
    if (!nom || !mois|| !prix || !annee ) {
      return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
    }
    const categorie =await DepenseCategorie.findById(id_categorie);
    if (!categorie ) {
      return res.status(404).json({ message: 'categorie non existante' });
    }
    
    const depense = new DepenseModel({ nom,categorie:categorie,prix,mois,annee});
    await depense.save();
    return res.status(201).json({ message: 'Depense bien enregistrer' });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};


  const supprimer = async (req, res, next) => {
    try{
      const empid = req.params.id;
      const deletedDocument = await DepenseModel.findByIdAndDelete(empid);
      if (!deletedDocument) {
          return res.status(404).json({ message: 'Depense non existante' });
      }
      res.json({ message: 'Depense bien supprimé', deletedDocument });
  }
  catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  const modifier = async (req, res, next) => {
    try {
      const id = req.params.id;
      const {nom,prix,mois,annee,id_categorie} = req.body;  
      if (!nom || !mois|| !prix || !annee ) {
        return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
      }
      const categorie =await DepenseCategorie.findById(id_categorie);
      if (!categorie ) {
        return res.status(404).json({ message: 'categorie non existante' });
      }
      
      const depense = new DepenseModel.findByIdAndUpdate(id,{ nom,categorie:categorie,prix,mois,annee}, { new: true });
      return res.status(201).json({ message: 'element bien modifier' });

    
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }

  const rechercher = async (req, res, next) => {
    

  }

  const getall = async (req, res, next) =>{
    try{
      const details=await DepenseModel.find({type:2});
      return res.json(details);
    }catch (error) {
      console.error('Error setting up notification stream:', error);
    }
  }
  module.exports = {creer,supprimer,modifier,rechercher,getall}