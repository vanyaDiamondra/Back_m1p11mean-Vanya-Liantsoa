const PrefServiceModel = require("../models/PrefServiceModel");
const ServiceModel = require("../models/ServiceModel");
const UtilisateurService=require("../services/UtilisateurService");
const UtilisateurModel=require("../models/UtilisateurModel");
const moment = require('moment-timezone');

const ajoutPref = async(req, res, next) => {
    try {
        const{token,note}=req.body;

        // get user avec le token
        const user=await UtilisateurService.getUserByToken(token);
        if(!user){
            return res.status(404).json({ message: 'token invalide' });
        }

        // Créez l'objet clientData
        const clientData = {
            "_id": user._id,
            "nom": user.nom,
            "prenom": user.prenom
        };

        return res.json(await PrefServiceModel.find());    

        // prendre les informations sur le service
        // const serviceId = req.params.id;
        // const service =await ServiceModel.findById(serviceId);
        // if (!service ) {
        //     return res.status(404).json({ message: 'service non existante' });
        // }
        
        // // Créez l'objet serviceData
        // const serviceData={
        //     "_id":service._id,
        //     "nom":service.nom,
        //     "nom_categorie":service.nom_categorie
        // };
        


        //  const moscowTime = moment().tz('Europe/Moscow').startOf('day').format('YYYY-MM-DD');
     

        //  const newPrefService = new PrefServiceModel({
        //     service: serviceData,
        //     client: clientData,
        //     note: note,
        //     date: moscowTime
        //  });
         
        // await newPrefService.save();
       
        // return res.status(201).json({ message: 'PrefService created successfully!' });

       
    } catch (error) {
        //
       // console.error('Error finding user:', error);
        res.status(500).json({ message: error });
    }
    

}

module.exports = { ajoutPref};