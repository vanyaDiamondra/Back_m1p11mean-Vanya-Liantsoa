const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  }
});

const userSchema = new mongoose.Schema({
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

const PrefEmployeModel = new mongoose.Schema({
    employe: userSchema,
    client: userSchema,
    service: serviceSchema,
    note: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    }
},{collection:'pref_emp'})

const PrefEmploye = mongoose.model('pref_emp', PrefEmployeModel);
module.exports = PrefEmploye;