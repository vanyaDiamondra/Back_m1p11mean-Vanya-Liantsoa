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
    nom_categorie: {
      type: String,
      required: true,
    },
  });
  
  // Define the Client Schema
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
  

  const PrefServiceSchema = new mongoose.Schema({
    service: {
      type: serviceSchema,
      required: true,
    },
    client: {
      type: clientSchema,
      required: true,
    },
    note: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },{collection:'pref_service'})

  const PrefService = mongoose.model('pref_service', PrefServiceSchema);

  module.exports = PrefService;