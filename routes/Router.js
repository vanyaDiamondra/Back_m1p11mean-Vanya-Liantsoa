const express = require('express');
const router = express.Router();

const utilisateurController = require('../controllers/UtilisateurController');
const serviceController =  require('../controllers/ServiceController');
const offreSpecialController =  require('../controllers/OffreSpecialController');
const prefServiceController = require('../controllers/PrefServiceController');
const prefEmpController = require('../controllers/PrefEmpController');
const sendMail = require('../controllers/MailController');

const rdvCotronller =  require('../controllers/RdvController');
const employeController =  require('../controllers/EmployeController');
const statistiqueController =  require('../controllers/StatistiqueController');

router.get('/utilisateur',utilisateurController.getUtilisateur);
router.post('/user/inscription',utilisateurController.inscription);
router.post('/user/login',utilisateurController.login);
router.get('/token', utilisateurController.verificationToken);

router.get('/service', serviceController.getServices);
router.get('/service/search', serviceController.searchServices);
router.get('/service/categories', serviceController.getCategorieServices);
router.get('/service/client', serviceController.getEmployePrefereeUser);
router.post('/service/ajoutprefservice/:id',prefServiceController.ajoutPref);
router.post('/service/ajoutprefemp/:id',prefEmpController.ajoutPref);
router.get('/service/getprefnote/:id',prefServiceController.getPrefNote);
router.get('/service/prefService',serviceController.getPrefServices);

router.get('/offrespeciale', offreSpecialController.getOffres);

router.post('/rdv/check', rdvCotronller.checkPossibilityRdv);
router.post('/rdv', rdvCotronller.paymentRdv);
router.get('/rdv', rdvCotronller.historique);


router.post('/sendmail',sendMail.sendConfirmationEmail);

router.get('/:id/verify/:token',utilisateurController.urlVerify);

router.get('/employe/rdv', employeController.getRdv);
router.get('/employe/tasks', employeController.getTaches);
router.get('/employe/tasks/done', employeController.getTachesFinis);
router.get('/employe/tasks/setdone', employeController.setStatusTachesFini);
router.get('/employe/tasks/rollbackdone', employeController.rollBackStatusTachesFini);
router.get('/notifications/stream',offreSpecialController.sse);

router.get('/stat/avgemp', statistiqueController.getTempsMoyenEmploye);
router.get('/stat/reservation', statistiqueController.getNbReservation); 
router.get('/stat/ca', statistiqueController.getChiffreDAffaires);

module.exports = router;