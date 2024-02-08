const mongoose = require('mongoose');


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


const PrefEmpSchema = new mongoose.Schema({
  employe: {
    type: employeeSchema,
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
},{collection:'pref_emp'});

// Create the PrefEmp model
const PrefEmp = mongoose.model('pref_emp', PrefEmpSchema);

module.exports = PrefEmp;