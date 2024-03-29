const UtilisateurModel = require("../models/UtilisateurModel");
const Token = require("../models/Token");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const {secretKey,base_url} = require("../db/TokenKey");
const sendEmail = require("../services/EmailService");
const HoraireEmp = require("../models/HoraireEmpModel");
const moment = require('moment-timezone');

const getUtilisateur = async (req, res, next) => {
  try {
    const utilisateurs = await UtilisateurModel.find();
    res.json(utilisateurs);
  } 
  catch (err) {
    throw err.message;
  }
};

const inscription = async (req, res, next) => {
  try {
    
    const {nom,prenom,contact,email,sexe,date_naissance,mdp} = req.body;

    //Vérification champ vide
    if (!nom || !prenom|| !contact || !sexe || !mdp || !email) {
      return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
    }

    // Vérification date
    const today = new Date();
    const dateNaissance = new Date(date_naissance);
    if (dateNaissance >= today) {
      return res.status(400).json({ message: 'Date de naissance invalide' });
    }

    //Vérification si mail déjà existance
    const user = await UtilisateurModel.findOne({ email });
		if (user)
			return res.status(401).send({ message: "Email déjà existante" });

    //enregistrement
    const mdphashe = await bcrypt.hash(mdp, 10);
    const utilisateur = new UtilisateurModel({ nom,prenom,contact,email,sexe,date_naissance,mdp:mdphashe,type:1,photo:""});
    await utilisateur.save();
    //res.status(201).json({ message: 'Utilisateur bien enregistré' });


    const token = await new Token({
			userId: utilisateur._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();

		const url = `${base_url}/${utilisateur._id}/verify/${token.token}`;
		await sendEmail(utilisateur.email, "Confirmation inscription salon de beauté", url);

		return res
			.status(201)
			.send({ message: "Un email vous a été envoyé, veuillez vérifier votre compte et confirmer l'inscription" });


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, mdp } = req.body;
    const utilisateur = await UtilisateurModel.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({ message: email });
    }
    const mdpValide = await bcrypt.compare(mdp, utilisateur.mdp);
    if (!mdpValide) {
      return res.status(401).json({ message: 'Mot de passe invalide' });
    }
    if (!utilisateur.verified) {
			let token = await Token.findOne({ userId: utilisateur._id });

			if (!token) {
        await sendEmail(utilisateur.email, "Verify Email", url);
				token = await new Token({
					userId: utilisateur._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();

        const url = `${base_url}/${utilisateur._id}/verify/${token.token}`;
				await sendEmail(utilisateur.email, "Verify Email", url);
			}

			return res
				.status(400)
				.send({ message: "Un email vous a été envoyer veuillez verifier votre compte" });
		}
    const token = jwt.sign({ userId: utilisateur._id }, secretKey, { expiresIn: 86400 });
    res.status(200).json({ status: "200", message: 'Vous êtes connecté', profilId: utilisateur.type, token: token });    
    //res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};

const verificationToken = async(req, res, next) => {
  const token = req.query.token;

  if (!token) {
    return res.json({status: '401',message: 'Aucun token' });
  }
 
  jwt.verify(token, secretKey , (err, decoded) => {
    if(err){
      if (err.name === 'TokenExpiredError') {
        return res.json({status: '401',message: 'Token expirée '+token });
      } 
      else {
        return res.json({status: '401', message: 'Token non valide' });
      }
    }
    else{
      res.json({status: '200', message: 'ok' });
      next();
    }
  });
}

const urlVerify = async(req,res,next)=>{
  try {
		const user = await UtilisateurModel.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Lien invalide" });

    console.log(req.params.token);

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
    
		if (!token) return res.status(400).send({ message: "Lien invalide" });

		await UtilisateurModel.updateOne({ _id: user._id }, { verified: true });
    const deletedToken = await Token.findByIdAndDelete(token._id);

		return res.status(200).send({ message: "Email vérifié avec succès" });
	} catch (error) {
		return res.status(500).send({ message: error.message });
	}
}
const upload= async (req, res) => {
  try {
    const { fileName, url } = req.body;
    const picture = new Picture({ fileName, url });
    await picture.save();
    res.status(201).json({ message: 'Picture saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserInfo= async (req,res)=>{
  try {
    const token = req.query?.token;
    const id = req.query?.id;
    console.log(token);
    //console.log(id);
    if(token != null){
      const userId = jwt.verify(token, secretKey);
      const userInfo = await UtilisateurModel.findById(userId.userId);
      console.log(userInfo);
      const horaire = await HoraireEmp.find({'employe.id':userId.userId}).sort({ date: -1 }).limit(1).exec();;
      const serviceObject = userInfo.toObject();
      serviceObject.debut = horaire[0].debut;
      serviceObject.fin = horaire[0].fin;
      return res.json(serviceObject);
    }
    if(id != null){
      const userInfo = await UtilisateurModel.findById(id);
      console.log(userInfo);
      const horaire = await HoraireEmp.find({'employe.id':id}).sort({ date: -1 }).limit(1).exec();;
      const serviceObject = userInfo.toObject();
      serviceObject.debut = horaire[0].debut;
      serviceObject.fin = horaire[0].fin;
      return res.json(serviceObject);
    }
    

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const updateProfil= async (req,res)=>{
  try {
    const {nom,prenom,contact,date_naissance,token,debut,fin} = req.body;

    const userId = jwt.verify(token, secretKey);
    //Vérification champ vide
    if (!nom || !prenom|| !contact ) {
      return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
    }

    // Vérification date
    const today = new Date();
    const dateNaissance = new Date(date_naissance);
    if (dateNaissance >= today) {
      return res.status(400).json({ message: 'Date de naissance invalide' });
    }

    const updatedDocument = await UtilisateurModel.findByIdAndUpdate(userId.userId, { nom: nom,prenom:prenom,contact:contact, date_naissance:date_naissance }, { new: true });

    console.log(updatedDocument);
    const moscowTime = moment().tz('Europe/Moscow').startOf('day').toDate();
    const user={
      'id':updatedDocument._id,
      'nom':nom,
      'prenom':prenom
    };
    const horaire=new HoraireEmp({
      employe:user,
      'debut':debut,
      'fin':fin,
      'date':moscowTime
    });
    console.log(horaire);
    await horaire.save();
    return res.json({message : 'utilisateur bien mis à jour'});

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const updatePic= async (req,res)=>{
  try {
    const {token,url} = req.body;
    const userId = jwt.verify(token, secretKey);
    const updatedDocument = await UtilisateurModel.findByIdAndUpdate(userId.userId, { photo: url }, { new: true });
    console.log(updatedDocument);
    return res.json({message:'image mis à jour'})
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = { getUtilisateur, inscription,login, verificationToken ,urlVerify,getUserInfo,updateProfil,updatePic};
