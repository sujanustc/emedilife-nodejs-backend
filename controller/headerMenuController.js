const HeaderMenu = require("../models/headerMenu");
const { errorResponse, response } = require("../utils/utils");

module.exports.addHeaderMenu = async (req, res, next) => {
    try {
        const { title, url, status, serial } = req.body;
        //validations
        if (!title || !url) return response(res, { message: "Missing Fields", status: false, statusCode: 400 });

        //checking deplicate available or not
        const menuExist = await HeaderMenu.findOne({ title: title });
        if (menuExist) return response(res, { message: "A menu with this title already exist", status: false });

        //Inserting data
        const headerMenu = new HeaderMenu({ title: title, url: url, status: status, serial: serial });
        const data = await headerMenu.save();
        if (data) return response(res, { message: "Header Menu Added Successfully!" }, data);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.editHeaderMenuById = async (req, res, next) => {
    try {
        const { _id, title, status, url, serial } = req.body;
        if (!_id || !title || !status || !url || !serial) res.status(500).json({ message: "Missing Fields" });
        const menuExist = await HeaderMenu.findOne({ _id: _id }).lean();

        if (!menuExist) return response(res, { message: "A menu with this title does not exist", status: false });

        const data = await HeaderMenu.updateOne(
            { _id: _id },
            { $set: { title: title, url: url, status: status, serial: serial } }
        );
        if (data) return response(res, { message: "Header Menu Modifyed Successfully!" }, data);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.deleteMenuById = async (req, res, next) => {
    try {
        const { _id } = req.body;
        const menu = await HeaderMenu.findOne({ _id: _id }).lean();
        if (!menu) return response(res, { message: "Menu with this id does not exist" });
        const data = await HeaderMenu.deleteOne({ _id: _id });
        return response(res, { message: "Menu deleted successfully" }, data);
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.getAllHeaderMenus = async (req, res, next) => {
    try {
        var data = await HeaderMenu.find().sort({ serial: 1 });
        data.sort((a, b) => (a.serial != null ? a.serial : Infinity) - (b.serial != null ? b.serial : Infinity));
        return response(res, { message: "Header Menu Get Successfully!" }, data);
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.getHeaderMenuById = async (req, res, next) => {
    try {
        const { _id } = req.body;
        //validations
        if (!_id) return response(res, { message: "Missing Fields", status: false, statusCode: 400 });

        const menu = await HeaderMenu.findOne({ _id: _id });
        if (menu) return response(res, { message: "Header Menu Get Successfully!" }, menu);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.getAllHomeHeaderMenus = async (req, res, next) => {
    try {
        const menus = await HeaderMenu.find({ status: 1 }).sort({ serial: 1 });
        if (menus) return response(res, { message: "Header Menus Get Successfully!" }, menus);
        return errorResponse(res, "Something wrong . Please try agian later or contact to support!");
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};
