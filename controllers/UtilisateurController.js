const UtilisateurModel = require("../models/UtilisateurModel");

const getUtilisateur = async (req, res, next) => {
  try {
    const utilisateurs = await UtilisateurModel.find();
    res.json(utilisateurs);
  } 
  catch (err) {
    throw err.message;
  }
};


module.exports = { getUtilisateur };