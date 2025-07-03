const express = require('express');
const router = express.Router();
const ambassadorController = require('../controllers/ambassador.controller');

router.get('/', ambassadorController.getAllAmbassadors);
router.get('/search', ambassadorController.searchAmbassadorNames);
router.post('/', ambassadorController.createAmbassador);
router.put('/:id', ambassadorController.updateAmbassador);
router.delete('/:id', ambassadorController.deleteAmbassador);

module.exports = router; 