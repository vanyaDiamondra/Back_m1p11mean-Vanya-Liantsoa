const RdvModel = require("../models/RdvModel");
const jwt = require('jsonwebtoken');
const {secretKey} = require("../db/TokenKey");
const { tryRdv, payment, historiqueRdv } = require('../services/RdvService');


const checkPossibilityRdv = async (req, res, next) => {
    const {token, serviceId, dateEtHeureRdv} = req.body;
    const userId = jwt.verify(token, secretKey);
  
    const rdv = await tryRdv(userId, serviceId, dateEtHeureRdv);
    res.json(rdv);
};

const paymentRdv = async (req, res, next) => {
    const {rdv} = req.body;
    
    const result = await payment(rdv);
    res.json({status: "200"});
};

const historique = async (req, res, next) => {
    const token = req.query.token;
    
    const userId = jwt.verify(token, secretKey);
  
    const rdv = await historiqueRdv(userId);
    res.json(rdv);
};

module.exports = { checkPossibilityRdv, paymentRdv, historique };


