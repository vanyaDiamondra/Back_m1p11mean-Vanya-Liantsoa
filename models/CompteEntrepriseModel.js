const mongoose = require('mongoose')


const CompteEntrepriseSchema = new mongoose.Schema({
    solde: {
      type: Number,
      required: true,
    }
},{collection:'compte_entreprise'})

const CompteEntreprise = mongoose.model('compte_entreprise', CompteEntrepriseSchema);
module.exports = CompteEntreprise;