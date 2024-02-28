const { tempsMoyenParEmploye, nbReservation, chiffreAffaires, beneficeTotal } = require('../services/StatistiqueService');

const getTempsMoyenEmploye = async (req, res, next) => {
  try {
    const result = await tempsMoyenParEmploye();
    res.json(result);
  } 
  catch (err) {
    throw err.message;
  }
};

const getNbReservation = async (req, res, next) => {
    try {
      const mois = parseInt(req.query.mois, 10);
      const result = await nbReservation(mois);
      res.json(result);
    } 
    catch (err) {
      throw err.message;
    }
};
  
const getChiffreDAffaires = async (req, res, next) => {
  try {
    const mois = parseInt(req.query.mois, 10);
    const result = await chiffreAffaires(mois);
    res.json(result);
  } 
  catch (err) {
    throw err.message;
  }
};

const getBenefice = async (req, res, next) => {
  try {
    const annee = parseInt(req.query.annee, 10);
    const result = await beneficeTotal(annee);
    res.json(result);
  } 
  catch (err) {
    throw err.message;
  }
};


module.exports = { getTempsMoyenEmploye, getNbReservation, getChiffreDAffaires, getBenefice };