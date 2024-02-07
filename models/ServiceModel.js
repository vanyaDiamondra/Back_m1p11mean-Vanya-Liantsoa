const mongoose = require('mongoose')


const employeeSchema = new mongoose.Schema({
    id: {
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
        default: '', // You can set a default value for the image path
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
        type: [employeeSchema], // Array of employees
      }
},{collection:'service'})

const Service = mongoose.model('service', ServiceSchema);
module.exports = Service;