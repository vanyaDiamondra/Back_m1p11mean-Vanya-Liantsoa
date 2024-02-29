const OffreSpecial = require("../models/OffreSpecialModel");
const ServiceModel = require("../models/ServiceModel");

const getOffres = async (req, res, next) => {
  try {
    const offres = await OffreSpecialModel.find();
    res.json(offres);
  } 
  catch (err) {
    throw err.message;
  }
};


// Server-Sent Events 
const sse = async (req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendOffre = offre => {
    try {
      console.log('Sending offre:', offre);
      res.write(`data: ${JSON.stringify(offre)}\n\n`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  try {
    const stream = OffreSpecial.find().tailable().cursor();
    stream.on('data', offre => {
      sendOffre(offre);
    });

    stream.on('error', err => {
      console.error('Error streaming notifications:', err);
    });

    stream.on('close', () => {
      console.log('Notification stream closed');
    });

    req.on('close', () => {
      stream.close();
    });
  }
  catch (error) {
    console.error('Error setting up notification stream:', error);
  }

  
};

const getOffreSpec = async (req, res, next) => {
  try{
    const id=req.params.id;
    const details=await OffreSpecialModel.findById(id);
    return res.json(details);
  }catch (error) {
    console.error('Error setting up notification stream:', error);
  }
 
}

const creer = async (req, res, next) => {
  try {
  const {nom,description,prix,id_service} = req.body;  
  if (!nom || !description|| !prix ) {
    return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
  }
  const service =await ServiceModel.findById(id_service);
  if (!service ) {
    return res.status(404).json({ message: 'service non existante' });
  }
  const serviceData={
    "_id":service._id,
    "nom":service.nom,
    "image":service.service
  };
  const offre = new OffreSpecial({ nom,description,prix,service:serviceData});
  await offre.save();
  return res.status(201).json({ message: 'Offre bien enregistrer' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const supprimer = async (req, res, next) => {
  try{
    const empid = req.params.id;
    const deletedDocument = await OffreSpecial.findByIdAndDelete(empid);
    if (!deletedDocument) {
        return res.status(404).json({ message: 'Offre non existante' });
    }
    res.json({ message: 'Offre bien supprimé', deletedDocument });
  }
  catch (error) {
      res.status(500).json({ message: error.message });
  }
}

const modifier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {nom,description,prix,id_service} = req.body;  
    if (!nom || !description|| !prix ) {
      return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
    }
    const service =await ServiceModel.findById(id_service);
    if (!service ) {
      return res.status(404).json({ message: 'service non existante' });
    }
    const updatedDocument = await OffreSpecial.findByIdAndUpdate(id, { nom: nom,description:description,prix:prix }, { new: true });
    return res.status(201).json({ message: 'Element bien modifier' });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

const rechercher = async (req, res, next) => {
  const {mot,min,max} = req.body; 
  if(min ==0 && max == 0){
    const searchQuery = {
      $or: [
        { name: { $regex: mot, $options: 'i' } }, 
        { description: { $regex: mot, $options: 'i' } }
      ]
    };
    OffreSpecial.find(searchQuery, (err, offres) => {
      if (err) {
        res.status(500).json({ message: error.message });
      } else {
        return res.json(offres);
      }
    });

    
  }
  else if (max == 0){
    const searchQuery = {
      $and: [
        { $or: [
          { name: { $regex: 'net', $options: 'i' } },
          { description: { $regex: 'net', $options: 'i' } } 
        ]},
        { price: { $gt: min } } 
      ]
    };
    OffreSpecial.find(searchQuery, (err, offres) => {
      if (err) {
        res.status(500).json({ message: error.message });
      } else {
        return res.json(offres);
      }
    });
  }
  else{
    const searchQuery = {
      $and: [
        { $or: [
          { name: { $regex: 'net', $options: 'i' } },
          { description: { $regex: 'net', $options: 'i' } } 
        ]},
        { price: { $gt: min , $lt: max} } 
      ]
    };
    OffreSpecial.find(searchQuery, (err, offres) => {
      if (err) {
        res.status(500).json({ message: error.message });
      } else {
        return res.json(offres);
      }
    });
  }
}
const getall = async (req, res, next) =>{
  try{
    const details=await OffreSpecialModel.find();
    return res.json(details);
  }catch (error) {
    console.error('Error setting up notification stream:', error);
  }
}



module.exports = { getOffres ,sse,getOffreSpec,creer,supprimer,modifier,rechercher ,getall};