const PrefEmpModel = require("../models/PrefEmpModel");
const UtilisateurService=require("../services/UtilisateurService");
const UtilisateurModel=require("../models/UtilisateurModel");
const moment = require('moment-timezone');

const ajoutPref = async(req, res, next) => {
    //const{token,note,idemp}=req.body;
    //const utilisateur=UtilisateurService.getUserByToken(token);
    try {
        const{token,note}=req.body;

        const user=UtilisateurService.getUserByToken(token);
        if(!user){
            return res.status(404).json({ message: 'token invalide' });
        }
        if (!user.id || !user.nom || !user.prenom) {
            res.status(400).json({ message: "Des données utilisateur requises sont manquantes." });
        } else {
            const clientData = {
                "id": user.id,
                "nom": user.nom,
                "prenom": user.prenom
            };
            
        }
       
        const employeId = req.params.id;
        const employe = await UtilisateurModel.findById(employeId);

        const employeeData={
            "id":employe.id,
            "nom":employe.nom,
            "prenom":employe.prenom
        };
        
        const moscowTime = moment().tz('Europe/Moscow').startOf('day').toDate();;

        if (!employe ) {
            return res.status(404).json({ message: 'employée non existante' });
        }

        const newPrefEmp = new PrefEmpModel({
            employe: employeeData, 
            client: clientData, 
            note: note,
            date: moscowTime
          });
        await newPrefEmp.save();
        res.status(201).json({ message: 'PrefEmp created successfully!' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error });
    }
    

}

module.exports = { ajoutPref};
