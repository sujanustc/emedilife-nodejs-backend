const Prescription = require("../models/prescription")
const User = require("../models/user");
const { getOffset } = require("../utils/utils");
const moment = require('moment')
exports.getAllPrescriptionByUser = async (req, res) => {
    var { userId, pageSize, page } = req.body;
    !userId ? userId = req.userData.userId : null
    if (!userId) return res.json({ status: false, message: "Missing Fields" })
    const userExist = await User.findOne({ _id: userId }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (!userExist) return res.json({ status: false, message: "User not Found" })

    var pLimit = parseInt(pageSize);
    let { offset, limit } = getOffset(page, pLimit);
    var data = await Prescription.find({ userId: userId, deletedAt: null }).skip(offset).limit(limit).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    const count = await Prescription.countDocuments({ userId: userId, deletedAt: null }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    if (data) {
        return res.status(200).json({
            status: true,
            data: data,
            count: count,
            message: 'All Prescription fetch Successfully!'
        });
    }
    else {
        return res.json({ status: false, message: "Something Wrong" })
    }

}

exports.renamePrescriptionByIdByUser = async (req, res) => {
    var { userId, title, prescriptionId } = req.body;
    !userId ? userId = req.userData.userId : null
    if (!prescriptionId || !title || !userId) return res.json({ status: false, message: "Missing Fields" })
    const prescriptionExist = await Prescription.findOne({ _id: prescriptionId, deletedAt: null }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (!prescriptionExist) return res.json({ status: false, message: "Prescription Not Found" })

    const data = await Prescription.updateOne({ _id: prescriptionId, deletedAt: null }, { title: title }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (data) {
        return res.status(200).json({
            status: true,
            data: data,
            message: 'Prescription Renamed Successfully!'
        });
    }
    else {
        return res.json({ status: false, message: "Something Wrong" })
    }
}

exports.getSinglePrescriptionByIdByUser = async (req, res) => {
    var { userId, prescriptionId } = req.body;
    !userId ? userId = req.userData.userId : null
    if (!userId || !prescriptionId) return res.json({ status: false, message: "Missing Fields" })
    const prescriptionExist = await Prescription.findOne({ _id: prescriptionId, deletedAt: null }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (!prescriptionExist) return res.json({ status: false, message: "Prescription Not Found" })
    return res.status(200).json({
        status: true,
        data: prescriptionExist,
        message: 'Prescription find Successfully!'
    });
}

exports.softDeletePrescriptonByUser = async (req, res) => {
    const { prescriptionId } = req.body;
    if (!prescriptionId) return res.json({ status: false, message: "Missing Fields" })
    const prescriptionExist = await Prescription.findOne({ _id: prescriptionId }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });
    if (!prescriptionExist) return res.json({ status: false, message: "Prescription Not Found" })

    const data = await Prescription.updateOne({ _id: prescriptionId }, { deletedAt: moment() }).catch(error => {
        console.log(error);
        return res.json({ status: false, error: error.message })
    });

    if (data) {
        return res.status(200).json({
            status: true,
            message: 'Prescription deleted Successfully!'
        });
    }
    else {
        return res.json({ status: false, message: "Something Wrong" })
    }
}