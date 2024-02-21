const jwt = require('jsonwebtoken');
const secretKey = require("../db/TokenKey");
const { getAllMyRdv, todayRdv, setRdvFinish } = require('../services/EmployeService');

const getRdv = async (req, res, next) => {
    const token = req.query.token;
    const month = req.query.month;
    const userId = jwt.verify(token, secretKey);
  
    const rdv = await getAllMyRdv(userId, month);
    res.json(rdv);
};

const getTaches = async (req, res, next) => {
    const token = req.query.token;
    const date = req.query.date;
    const userId = jwt.verify(token, secretKey);
  
    const rdv = await todayRdv(userId, date, 0);
    res.json(rdv);
};

const getTachesFinis = async (req, res, next) => {
    const token = req.query.token;
    const date = req.query.date;
    const userId = jwt.verify(token, secretKey);
  
    const rdv = await todayRdv(userId, date, 1);
    res.json(rdv);
};

const setStatusTachesFini = async (req, res, next) => {
    const rdv = req.query._id;

    await setRdvFinish(rdv, 1);
    res.json({status: '200'});
};

const rollBackStatusTachesFini = async (req, res, next) => {
    const rdv = req.query._id;

    await setRdvFinish(rdv, 0);
    res.json({status: '200'});
};


module.exports = { getRdv, getTaches, getTachesFinis, setStatusTachesFini, rollBackStatusTachesFini };


