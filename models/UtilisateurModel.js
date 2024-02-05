const mongoose = require('mongoose')

const UtilisateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
      },
      prenom: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      sexe: {
        type: String,
        enum: ['Homme', 'Femme'],
        required: true,
      },
      date_naissance: {
        type: Date,
        required: true,
      },
      mdp: {
        type: String,
        required: true,
      },
      type: {
        type: Number,
        required: true,
      },
      photo: {
        type: String,
        default: '', 
      }
},{collection:'utilisateur'})

const Utilisateur = mongoose.model('utilisateur', UtilisateurSchema);
module.exports = Utilisateur;