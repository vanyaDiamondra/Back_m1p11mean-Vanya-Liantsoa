const jwt = require('jsonwebtoken');
const UtilisateurModel = require('../models/UtilisateurModel');
const {secretKey} = require("../db/TokenKey");

const getUserByToken = async (token) => {
    try {
      
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
      
        const user = await UtilisateurModel.findById(userId);
        return user || null;
      } catch (error) {
        console.error('Error:', error);
        return error;
      }
  }

module.exports = { getUserByToken };