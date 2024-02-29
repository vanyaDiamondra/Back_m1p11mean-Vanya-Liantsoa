const PrefEmploye = require("../models/PrefEmployeModel");
const UtilisateurService=require("../services/UtilisateurService");
const UtilisateurModel=require("../models/UtilisateurModel");
const moment = require('moment-timezone');

const ajoutPref = async(req, res, next) => {
    //const{token,note,idemp}=req.body;
    //const utilisateur=UtilisateurService.getUserByToken(token);
    try {
        const{token,note}=req.body;

        //Find the registred user
        const user=await UtilisateurService.getUserByToken(token);
        if(!user){
            return res.status(404).json({ message: 'token invalide' });
        }

            const clientData = {
                "_id": user._id,
                "nom": user.nom,
                "prenom": user.prenom
            };

        // // Find the employee info
        const employeId = req.params.id;
        const employe = await UtilisateurModel.findById(employeId);

        const employeeData={
            "_id":employe._id,
            "nom":employe.nom,
            "prenom":employe.prenom
        };
        console.log(employeId);2
        const moscowTime = moment().tz('Europe/Moscow').startOf('day').toDate();;
        if (!employe ) {
            return res.status(404).json({ message: 'employée non existante' });
        }

        const documents = await PrefEmploye.find({
            'client._id': clientId,
            'employe._id': employeId
        });
        if (documents.length === 0) {
            const newPrefEmp = new PrefEmploye({
                employe: employeeData, 
                client: clientData, 
                note: note,
                date: moscowTime,
                service:{'_id':employeId}
              });
            console.log(newPrefEmp);
            await newPrefEmp.save();
        }
        else{
            const docid= documents[0]._id.toString();
            const depense = await PrefEmploye.findByIdAndUpdate(docid,{ note:note}, { new: true });
        }

        return res.status(201).json({ message: 'PrefEmp created successfully!' });
        
    } catch (error) {
        //
       // console.error('Error finding user:', error);
        return res.status(500).json({ message: error });
    }
    

}


module.exports = { ajoutPref};
