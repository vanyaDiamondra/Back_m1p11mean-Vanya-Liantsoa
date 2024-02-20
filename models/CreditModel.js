const mongoose = require('mongoose')

const rdvSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  }
});

const CreditSchema = new mongoose.Schema({
    rdv: rdvSchema,
    prix: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    }
},{collection:'credit'})

const Credit = mongoose.model('credit', CreditSchema);
module.exports = Credit;