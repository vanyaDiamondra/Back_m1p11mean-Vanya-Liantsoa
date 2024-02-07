const express = require('express');
const router = express.Router();


const utilisateur_controller=require('../controllers/UtilisateurController');


router.get('/utilisateur',utilisateur_controller.getUtilisateur);
router.post('/inscription',utilisateur_controller.inscription);
router.post('/login',utilisateur_controller.login);


module.exports = router;