const OffreSpecialModel = require("../models/OffreSpecialModel");

const getOffres = async (req, res, next) => {
  try {
    const offres = await OffreSpecialModel.find();
    res.json(offres);
  } 
  catch (err) {
    throw err.message;
  }
};


module.exports = { getOffres };