const express = require('express');
const router = express.Router();

const utilisateurController = require('../controllers/UtilisateurController');
const serviceController =  require('../controllers/ServiceController');
const offreSpecialController =  require('../controllers/OffreSpecialController');


router.get('/utilisateur',utilisateurController.getUtilisateur);
router.post('/inscription',utilisateurController.inscription);
router.post('/user/login',utilisateurController.login);
router.get('/utilisateur',utilisateurController.getUtilisateur);

router.get('/service', serviceController.getServices);
router.get('/service/search', serviceController.searchServices);
router.get('/service/categories', serviceController.getCategorieServices);

router.get('/offrespeciale', offreSpecialController.getOffres);


module.exports = router;