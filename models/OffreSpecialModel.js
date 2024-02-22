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
  image: {
    type: String,
    default: '', 
  }
});3

const OffreSpecialSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    description: {
      type: String
    },
    service: {
      type: serviceSchema,
      required: true,
    },
    prix: {
      type: Number, 
      required: true,
    }
},{collection:'offre'})

// const OffreSpecial = mongoose.model('offre', OffreSpecialSchema);
const OffreSpecial = mongoose.model('offre', OffreSpecialSchema);

const OffreSpecialCollection = mongoose.connection.collections['offre'];
if (!OffreSpecialCollection) {
  mongoose.connection.createCollection('offre', {
    capped: true,
    size: 1000000, 
  }).then(() => {
      console.log('Collection converted to capped collection successfully');
  }).catch((error) => {
      console.error('Error converting collection to capped collection:', error);
  });
}

// mongoose.connection.once('open', async () => {
//   try {
//     await mongoose.connection.db.createCollection('offre', {
//       capped: true,
//       size: 1000000, // Size of the capped collection in bytes
//     });
//     console.log('Collection converted to capped collection successfully');
//   } catch (error) {
//     console.error('Error converting collection to capped collection:', error);
//   }
// });
module.exports = OffreSpecial;