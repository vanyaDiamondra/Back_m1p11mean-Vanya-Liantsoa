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

const HoraireEmpSchema = new mongoose.Schema({
    employe: {
        type: employeeSchema,
        required: true,
      },
      debut: {
        type: String, 
        required: true,
      },
      fin: {
        type: String, 
        required: true,
      },
      date: {
        type: Date,
        required: true,
      }
},{collection:'horaire_emp'})

const HoraireEmp = mongoose.model('HoraireEmp', HoraireEmpSchema);
module.exports = HoraireEmp;