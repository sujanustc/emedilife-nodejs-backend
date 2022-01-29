// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const District = require('../models/district');

exports.addDistrict = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;


    const district = new District(data);

    try {
        const response = await district.save();
        res.status(200).json({
            response,
            message: 'District Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllDistricts = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const districts = await District.find()
    try {
        res.status(200).json({
            data: districts,
            count: districts.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getDistrictByDistrictId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const districtId = req.params.districtId;
    const district = await District.findOne({_id: districtId})

    try {
        res.status(200).json({
            data: district,
        });
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editDistrictData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await District.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'District Updated Successfully!'
        });

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteDistrictByDistrictId = async (req, res, next) => {

    const districtId = req.params.districtId;
    await District.deleteOne({_id: districtId});

    try {
        res.status(200).json({
            message: 'District Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
