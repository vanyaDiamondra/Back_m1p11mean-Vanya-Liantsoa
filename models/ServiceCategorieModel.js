const mongoose = require('mongoose')

const ServiceCategorieSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
      }
},{collection:'service_categorie'})

const ServiceCategorie = mongoose.model('service_categorie', ServiceCategorieSchema);
module.exports = ServiceCategorie;