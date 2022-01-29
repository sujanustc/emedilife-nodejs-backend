// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/district');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /district
 * http://localhost:9999/api/district
 */


router.post('/add-district',checkIpWhitelist,checkAdminAuth, controller.addDistrict);
router.get('/get-all-districts', controller.getAllDistricts);
router.get('/get-district-by-district-id/:districtId', controller.getDistrictByDistrictId);
router.put('/edit-district-by-district',checkIpWhitelist,checkAdminAuth, controller.editDistrictData);
router.delete('/delete-district-by-id/:districtId',checkIpWhitelist,checkAdminAuth, controller.deleteDistrictByDistrictId);

// Export All router..
module.exports = router;