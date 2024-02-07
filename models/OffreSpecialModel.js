const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  }
});

const OffreSpecialSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    description: {
      type: String
    },
    service: {
      type: serviceSchema,
      required: true,
    },
    prix: {
      type: Number, 
      required: true,
    }
},{collection:'offre'})

const OffreSpecial = mongoose.model('offre', OffreSpecialSchema);
module.exports = OffreSpecial;