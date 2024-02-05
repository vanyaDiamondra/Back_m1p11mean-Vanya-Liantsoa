const mongoose = require('mongoose')


const serviceSchema = new mongoose.Schema({
    id_service: {
      type: String,
      required: true,
    },
    nom_service: {
      type: String,
      required: true,
    },
    id_employe: {
      type: String,
      required: true,
    },
    nom_employe: {
      type: String,
      required: true,
    },
    prenom_employe: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    heure_debut: {
      type: String, 
      required: true,
    },
    heure_fin: {
      type: String, 
      required: true,
    },
  });
  

  const clientSchema = new mongoose.Schema({
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

const RdvSchema = new mongoose.Schema({
    client: clientSchema,
    services: [serviceSchema],
},{collection:'rdv'})

const Rdv = mongoose.model('rdv', RdvSchema);
module.exports = Rdv;