const mongoose = require('mongoose')

const DepenseSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: {
    _id: { 
      type: String,
      required: true 
    },
    nom: { 
      type: String, 
      required: true }
  },
  prix: { 
    type: Number, 
    required: true 
  },
  mois: { 
    type: String, 
    required: true },
  annee: { 
    type: String, 
    required: true }
},{collection:'depense'})

const Depense= mongoose.model('depense', DepenseSchema);
module.exports = Depense;