const express = require('express');
const router = express.Router();

const utilisateurController = require('../controllers/UtilisateurController');
const serviceController =  require('../controllers/ServiceController');
const offreSpecialController =  require('../controllers/OffreSpecialController');
const rdvCotronller =  require('../controllers/RdvController');
const employeController =  require('../controllers/EmployeController');

router.get('/utilisateur',utilisateurController.getUtilisateur);
router.post('/inscription',utilisateurController.inscription);
router.post('/user/login',utilisateurController.login);
router.get('/token', utilisateurController.verificationToken);

router.get('/service', serviceController.getServices);
router.get('/service/search', serviceController.searchServices);
router.get('/service/categories', serviceController.getCategorieServices);
router.get('/service/client', serviceController.getEmployePrefereeUser);

router.get('/offrespeciale', offreSpecialController.getOffres);

router.post('/rdv/check', rdvCotronller.checkPossibilityRdv);
router.post('/rdv', rdvCotronller.paymentRdv);
router.get('/rdv', rdvCotronller.historique);

router.get('/employe/rdv', employeController.getRdv);
router.get('/employe/tasks', employeController.getTaches);
router.get('/employe/tasks/done', employeController.getTachesFinis);
router.get('/employe/tasks/setdone', employeController.setStatusTachesFini);
router.get('/employe/tasks/rollbackdone', employeController.rollBackStatusTachesFini);

module.exports = router;