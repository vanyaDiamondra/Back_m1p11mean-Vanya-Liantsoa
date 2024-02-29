const ServiceModel = require("../models/ServiceModel");
const ServiceCategorieModel = require("../models/ServiceCategorieModel");
const jwt = require('jsonwebtoken');
const {secretKey} = require("../db/TokenKey");
const UtilisateurModel = require("../models/UtilisateurModel");
const { getPreferenceEmployeParService ,getPrefService} = require('../services/ServiceSalonService');

const getCategorieServices = async (req, res, next) => {
    try {
        const categories = await ServiceCategorieModel.find();
        res.json(categories);
    } 
    catch(err) {
        throw err.message;
    }
}

const getServices = async (req, res, next) => {
    try {
        const services = await ServiceModel.find();
        res.json(services);
    } 
    catch(err) {
        throw err.message;
    }
}

const searchServices = async (req, res, next) => {
    try {
        const nom = req.query.nom;
        const categorieID = req.query.categorieID;
        const _id = req.query._id;
        const conditions = {};

        if( nom !== undefined ){
            conditions.nom = new RegExp(nom, 'i');
        }
        if( categorieID !== undefined && categorieID !== '' ){
            conditions.id_categorie = categorieID;
        }
        if( _id !== undefined ){
            conditions._id = _id;
        }

        let services;
        if (Object.keys(conditions).length === 0) {
            services = await ServiceModel.find();
        } else if (_id !== undefined) {
            services = await ServiceModel.findOne(conditions);
        } else {
            services = await ServiceModel.find(conditions);
        }
        res.json(services);
    } 
    catch(err) {
        throw err.message;
    }
}

const getEmployePrefereeUser = async (req, res, next) => {
    const token = req.query.token;
    const _id = req.query._id;
    const service = await ServiceModel.findOne({_id: _id});

    
    const userId = jwt.verify(token, secretKey);

    const prefereeEmploye = await getPreferenceEmployeParService(userId, service);
    res.json(prefereeEmploye);
}

const getPrefServices = async (req, res, next) => {
    const token = req.query?.token;
    const userId = jwt.verify(token, secretKey);

    const prefServices = await getPrefService(userId);
    res.json(prefServices);
}



const creer = async (req, res, next) => {
    try {
    const {nom,description,prix,image,id_categorie,nom_categorie,duree, commission,emp} = req.body; 
    if (!nom || !description|| !prix || !id_categorie || !nom_categorie || !duree || !commission) {
        return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
    }
    let foundEmployees = [];
    emp.forEach(employeeId => {
        UtilisateurModel.findById(employeeId, (err, employee) => {
          if (err) {
            console.error('Error finding employee:', err);
          } else {
            if (employee) {
                const employeData={
                    "_id":employee._id,
                    "nom":employee.nom,
                    "prenom":employee.prenom,
                    "photo":employee.photo
                };
              foundEmployees.push(employeData);
            } else {
              console.log('Employee not found with ID:', employeeId);
            }
          }
        });
      });
      const service = new ServiceModel({ nom,description,prix,image,id_categorie,nom_categorie,duree,commission,employe:foundEmployees});
      await service.save();
      return res.status(201).json({ message: 'Service bien enregistrer' });
      
  
  
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const supprimer = async (req, res, next) => {
    try{
        const empid = req.params.id;
        const deletedDocument = await ServiceModel.findByIdAndDelete(empid);
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Service non existante' });
        }
        res.json({ message: 'Service bien supprimé', deletedDocument });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
      }
  }

  const modifier = async (req, res, next) => {
   
    try{
      const id = req.params.id;
      const {nom,description,prix,image,id_categorie,nom_categorie,duree, commission,emp} = req.body; 
      if (!nom || !description|| !prix || !id_categorie || !nom_categorie || !duree || !commission) {
          return res.status(400).json({ message: 'Le remplissage de tous les champs est requis' });
      }
      let foundEmployees = [];
      emp.forEach(employeeId => {
          UtilisateurModel.findById(employeeId, (err, employee) => {
            if (err) {
              console.error('Error finding employee:', err);
            } else {
              if (employee) {
                  const employeData={
                      "_id":employee._id,
                      "nom":employee.nom,
                      "prenom":employee.prenom,
                      "photo":employee.photo
                  };
                foundEmployees.push(employeData);
              } else {
                console.log('Employee not found with ID:', employeeId);
              }
            }
          });
        });
        const service = new ServiceModel.findByIdAndUpdate(id,{ nom,description,prix,image,id_categorie,nom_categorie,duree,commission,employe:foundEmployees}, { new: true });
        return res.status(201).json({ message: 'Element bien modifier' });
  }
  catch (error) {
      res.status(500).json({ message: error.message });
    }

  }
  const getall = async (req, res, next) =>{
    try{
      const details=await ServiceModel.find();
      return res.json(details);
    }catch (error) {
      console.error('Error setting up notification stream:', error);
    }
  }
  const findByid = async (req, res, next) =>{
    try{
      const id = req.params.id;
      const details=await ServiceModel.findById(id);
      return res.json(details);
    }catch (error) {
      console.error('Error setting up notification stream:', error);
    }
  }

module.exports = { getServices, getCategorieServices, searchServices, getEmployePrefereeUser,getPrefServices,creer,supprimer,modifier,getall ,findByid};