const mongoose = require('mongoose')

const rdvSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  }
});

const DepenseSchema = new mongoose.Schema({
    rdv: rdvSchema,
    prix: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    }
},{collection:'depense'})

const DepenseModel = mongoose.model('depense', DepenseSchema);
module.exports = DepenseModel;