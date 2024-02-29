const PrefEmploye = require("../models/PrefEmployeModel");
const Service = require("../models/ServiceModel");
const HoraireEmp = require("../models/HoraireEmpModel");
const Rdv = require("../models/RdvModel");
const Utilisateur = require("../models/UtilisateurModel");
const Credit = require("../models/CreditModel");
const CompteEntreprise = require("../models/CompteEntrepriseModel");
const nodemailer = require('nodemailer');

const historiqueRdv = async (userId)  => {
    const rdvList = await Rdv.find({'client._id': userId.userId})
                    .sort({ heure_debut: -1 });

    return rdvList;
}

const tryRdv = async (userId, serviceId, dateEtHeureRdv)  => {
    let response = {rdv: {}, message: ''};
    const service = await Service.findOne({_id: serviceId});

    const date = new Date(dateEtHeureRdv.split('T')[0]);
    const debut = new Date(dateEtHeureRdv);
    const fin = addMinutesToDate(debut, service.duree);
    const employe = await suggestEmployeRdv(userId, service, debut, fin, date, response);
    const client = await Utilisateur.findOne({_id: userId.userId});
   
    if( employe !== null ){
        response.rdv = constructRdv(client, service, employe, date, debut, fin);
    }
    return response;
}

const payment = async (rdv)  => {
    const rdvModel = new Rdv(rdv);
    await rdvModel.save();

    const credit = {
        rdv:{
            _id: rdvModel._id,
        },
        prix: rdv.service.prix,
        date: new Date() 
    }
    const creditModel = new Credit(credit);
    await creditModel.save();

    await CompteEntreprise.findOneAndUpdate(
        {},
        { $inc: { solde: rdv.service.prix } }
    );
}

const constructRdv = (client, service, employe, date, debut, fin) => {
    const rdv = {
        client: {
            _id: client._id,
            nom: client.nom,
            prenom: client.prenom
        },
        service: {
            _id: service._id,
            nom: service.nom,
            duree: service.duree,
            image: service.image,
            prix: service.prix,
            commission: service.commission
        },
        employe: {
            _id: employe._id,
            nom: employe.nom,
            prenom: employe.prenom
        },
        date: date,
        datereservation: new Date(),
        heure_debut: debut, 
        heure_fin: fin
    }
    return rdv;
}

const suggestEmployeRdv = async (userId, service, debut, fin, date, response) => {
    var maxPrefEmploye = await PrefEmploye.findOne({'client._id': userId.userId, 'service._id': service._id})
                                .sort({ note: -1 })
                                .limit(1);

    if( maxPrefEmploye ){
        maxPrefEmploye = await Utilisateur.findOne({_id: maxPrefEmploye.employe._id});
        const checkPref = await checkPossibilityEmploye(maxPrefEmploye, debut, fin, date);
        if( checkPref === true ){
            response.message = "Votre employé préféré vous recevra";
            return maxPrefEmploye;
        }
    }
    const employeList = service.employe;
    for( let employe of employeList ){
        let disponibility = await checkPossibilityEmploye(employe, debut, fin, date);
        
        if( disponibility === true ){
            let result = await Utilisateur.findOne({_id: employe.id});

            if( maxPrefEmploye ){
                response.message = "Désolé votre employé préféré est déja pris à cette heure";
            }           
            return result;
        }
    }
    response.message = "Désolé, aucun employé disponible à cette heure.";
    return null;
}

function addMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000); //  1 minute = 60000 milliseconds
}

const checkPossibilityEmploye = async(employe, debut, fin, date) => {
    const horaireTravail = await checkHoraireDeTravail(employe, debut, fin, date);
    const disponibiliteRdv = await checkDisponibilite(employe, debut, fin, date);
    
    if( horaireTravail === true && disponibiliteRdv === true) {
        return true;
    }
    return false;
}

async function checkHoraireDeTravail(employe, debut, fin, date) {
    const last_horaire_emp = await HoraireEmp.findOne({'employe.id': employe._id})
                            .sort({ date: -1 })
                            .limit(1); 

    if (last_horaire_emp) {
        const prev_deb = new Date(date.toISOString().split('T')[0]+'T'+last_horaire_emp.debut);
        const prev_fin = new Date(date.toISOString().split('T')[0]+'T'+last_horaire_emp.fin);
        
        if( debut >= prev_deb && fin <= prev_fin ){
            return true;
        }
    }

    return false;
}

async function checkDisponibilite(employe, debut, fin, date) {
    const rdvList = await Rdv.find({'employe._id': employe._id, date: date});
    
    for (let rdv of rdvList) {
        if( rdvHeureChevauchent(rdv.heure_debut, rdv.heure_fin, debut, fin) ){
            return false;
        }
    }
    return true;
}

function rdvHeureChevauchent(debut1, fin1, debut2, fin2) {
    return (
        (debut1 >= debut2 && debut1 <= fin2) || // debut1 est entre debut2 et fin2
        (fin1 >= debut2 && fin1 <= fin2) ||     // fin1 est entre debut2 et fin2
        (debut2 >= debut1 && debut2 <= fin1) || // debut2 est entre debut1 et fin1
        (fin2 >= debut1 && fin2 <= fin1)        // fin2 est entre debut1 et fin1
    );
}

const emailingRdv = async (to, rdv, hour, client) => {
    try{
        const subject = "Rappel rendez-vous Rasm, Salon de beauté (m1p11mean-Vanya-Liantsoa)";
        const message = client.nom+" "+client.prenom+", votre rendez-vous pour "+rdv.service.nom+" est le "+rdv.date.split('T')[0]+". A bientôt, merci pour votre fidèlité";

        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'aureliekelen@gmail.com',
              pass: 'amalmlcqbqvdaimf'
            },
            tls: {
                rejectUnauthorized: false
              }
          });
      
          await transporter.sendMail({
            from: 'aureliekelen@gmail.com',
            to,
            subject,
            text: message
          });
    
        } catch (err) {
          console.error(err);
        }
    }
    catch (err) {
        console.error(err);
    }
};

const checkRappelEmail = async () => {
    const rdvList = await Rdv.find({status: 0});
    for( let rdv of rdvList ){
        const millisDiff = rdv.heure_debut - new Date();
        const hourDiff = millisDiff / (1000 * 60 * 60);

        if( hourDiff <= 24 && rdv.emailEnvoye == false ){
            const client = await Utilisateur.findOne({_id: rdv.client._id});
            emailingRdv( client.email, rdv, hourDiff, client );

            rdv.emailEnvoye = true;
            await rdv.save();
        }
    }
}

module.exports = {tryRdv, checkPossibilityEmploye, payment, historiqueRdv, checkRappelEmail}
