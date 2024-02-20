const jwt = require('jsonwebtoken');
const UtilisateurModel = require('../models/UtilisateurModel');
const getUserByToken = async (token) => {
    try {
      
        const decoded = jwt.verify(token, 'salon');
        const userId = decoded.userId;

        
      
        const user = await UtilisateurModel.findById(userId);
        return user || null;
      } catch (error) {
        console.error('Error:', error);
        return error;
      }
  }

module.exports = { getUserByToken };