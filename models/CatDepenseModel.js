const mongoose = require('mongoose')

const DepenseCategorieSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
      }
},{collection:'depense_categorie'})

const DepenseCategorie = mongoose.model('depense_categorie', DepenseCategorieSchema);
module.exports = DepenseCategorie;