const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    nom: {
      type: String,
      required: true,
    },
    duree: {
      type: Number, 
      required: true,
    },
    image: {
      type: String,
      required: true
    },
    prix: {
      type: Number, 
      required: true,
    },
    commission: {
      type: Number, 
      required: true,
    },
});

const clientSchema = new mongoose.Schema({
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
});

const RdvSchema = new mongoose.Schema({
    client: clientSchema,
    service: serviceSchema,
    employe: clientSchema,
    date: {
      type: Date,
      required: true,
    },
    datereservation : {
      type: Date,
      required: true,
    },
    heure_debut: {
      type: Date,
      required: true,
    }, 
    heure_fin: {
      type: Date, 
      required: true,
    },
    emailEnvoye: {
      type: Boolean,
      default: false
    },
    status: {
      type: Number,
      default: 0
    },
},{collection:'rdv'})

const Rdv = mongoose.model('rdv', RdvSchema);
module.exports = Rdv;