const errorResponse = (res, message = "") => {
    return res.status(500).json({
        status: false,
        message,
    });
};

const response = (res, { status = true, statusCode = 200, message = "success" }, data) => {
    return res.status(statusCode).json({
        status,
        message,
        data: data,
    });
};

const Product = require('../models/product.js')
const getNewListWithCount = (results, fieldName, next) => {
    var newData = [];
    results.forEach(async (item, index) => {
        var count2 = await Product.countDocuments({ fieldName: item.slug });
        newData.push({
            ...item._doc,
            productCount: count2,
        })
        if (index === results.length - 1) next(newData)
    });
}

const getOffset = (page, limit) => {
    let defaultLimit = 10;
    !limit ? (limit = defaultLimit) : null;
    !page ? (page = 1) : null;
    page = parseInt(page);
    limit = parseInt(limit);
    page === 0 ? (page = 1) : null;
    limit === 0 ? (limit = defaultLimit) : null;
    let offset = parseInt((page - 1) * limit);
    return {
        offset,limit,page
    }
  };

module.exports = {
    errorResponse,
    response,
    getNewListWithCount,
    getOffset
};
