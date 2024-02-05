const express = require('express');
const router = express.Router();


const utilisateur_controller=require('../controllers/UtilisateurController');


router.get('/utilisateur',utilisateur_controller.getUtilisateur);


module.exports = router;