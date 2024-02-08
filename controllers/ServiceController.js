const ServiceModel = require("../models/ServiceModel");
const ServiceCategorieModel = require("../models/ServiceCategorieModel");

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



module.exports = { getServices, getCategorieServices, searchServices };