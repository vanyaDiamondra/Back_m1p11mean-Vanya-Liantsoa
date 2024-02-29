const PrefServiceModel = require("../models/PrefServiceModel");
const ServiceModel = require("../models/ServiceModel");
const UtilisateurService=require("../services/UtilisateurService");
const jwt = require('jsonwebtoken');
const {secretKey} = require("../db/TokenKey");
const moment = require('moment-timezone');

const ajoutPref = async(req, res, next) => {
    try {
        const{token,note}=req.body;

        // get user avec le token
        const user=await UtilisateurService.getUserByToken(token);
        if(!user){
            return res.status(404).json({ message: 'token invalide' });
        }
        if (!user._id || !user.nom || !user.prenom) {
            // Gérez le cas où certaines propriétés sont manquantes
            res.status(400).json({ message: user});
        } 

        // Créez l'objet clientData
        const clientData = {
            "_id": user._id,
            "nom": user.nom,
            "prenom": user.prenom
        };    

        //prendre les informations sur le service
        const serviceId = req.params.id;
        const service =await ServiceModel.findById(serviceId);
        if (!service ) {
            return res.status(404).json({ message: 'service non existante' });
        }
        
        // Créez l'objet serviceData
        const serviceData={
            "_id":service._id,
            "nom":service.nom,
            "nom_categorie":service.nom_categorie
        };
        
        const moscowTime = moment().tz('Europe/Moscow').startOf('day').format('YYYY-MM-DD');

        const newPrefService = new PrefServiceModel({
            service: serviceData,
            client: clientData,
            note: note,
            date: moscowTime
         });
         
        await newPrefService.save();
       
        return res.status(201).json({ message: 'PrefService created successfully!' });

       
    } catch (error) {
        return res.status(500).json({ message: error });
    }
    

}
const getPrefNote = async(req, res, next) => {
    try {
        const id = req.params.id;
        const token = req.query.token;
        const userId = jwt.verify(token, secretKey);

        const lastPref = await PrefServiceModel.find({ 'service._id': id, 'client._id': userId.userId }).sort({ date: -1 }).limit(1).exec();
        return res.json(lastPref[0].note);
    }
    catch (error) {
        return res.json(0);
    }
}

module.exports = { ajoutPref,getPrefNote};