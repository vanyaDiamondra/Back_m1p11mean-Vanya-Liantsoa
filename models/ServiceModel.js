const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    }
  });

const ServiceSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      prix: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        default: '', 
      },
      id_categorie: {
        type: String,
        required: true,
      },
      nom_categorie: {
        type: String,
        required: true,
      },
      duree: {
        type: Number,
        required: true,
      },
      commission: {
        type: Number,
        required: true,
      },
      employe: {
        type: [employeeSchema], 
      }
},{collection:'service'})

const Service = mongoose.model('service', ServiceSchema);
module.exports = Service;