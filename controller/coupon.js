// Require Post Schema from Model..
const Coupon = require('../models/coupon');
const User = require('../models/user');
const utils = require('../helpers/utils')

/**
 * Add Coupon
 * Admin
 */

 exports.addCoupon = async (req, res, next) => {

    try {

        const data = req.body;
        const couponExists = await Coupon.findOne({couponCode: data.couponCode});

        if (couponExists) {
            res.status(200).json({
                success: false,
                message: 'A coupon with the same code already exists!'
            });
        } else {
            const coupon = new Coupon(data);
            await coupon.save();
            res.status(200).json({
                success: true,
                message: 'Added to Coupon Successfully!'
            });
        }


    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getCouponCouponId = async (req, res, next) => {
    const couponId = req.params.couponId;
    const coupon = await Coupon.findOne({_id: couponId});

    try {
        res.status(200).json({
            data: coupon,
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

/**
 * Edit Coupon
 * Admin
 */

 exports.editCouponData = async (req, res, next) => {

    const bodyData = req.body;

    try {
        await Coupon.findOneAndUpdate({_id: bodyData._id},
            {"$set": bodyData}
        )

        res.status(200).json({
            message: 'Edited Coupon Successfully!'
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

/**
 * Delete Coupon
 * Admin
 */

exports.deleteCoupon = async (req, res, next) => {

    const couponId = req.params.couponId;
    await Coupon.deleteOne({_id: couponId})

    await User.updateMany({}, {
        "$pull": {
            usedCoupons: couponId
        }
    });


    try {
        res.status(200).json({
            message: 'Deleted Coupon Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * Get All Coupon
 * Admin
 */


exports.getAllCoupons = async (req, res, next) => {


    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const select = req.query.select;

        let queryDoc;
        let countDoc;

        queryDoc = Coupon.find();
        countDoc = Coupon.find();

        if (pageSize && currentPage) {
            queryDoc.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }
        const data = await queryDoc.select(select ? select : '');
        const count = await countDoc;

        res.status(200).json({
            data: data,
            count: count
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * Use Coupon
 * User
 */

exports.checkCouponForApply = async (req, res, next) => {


    try {

        const userId = req.userData.userId;
        const couponCode = req.params.couponCode;

        // Check Coupon
        const coupon = await Coupon.findOne({couponCode: couponCode});
        const today = utils.getDateString(new Date());

        if (coupon) {
            const timeStartDay = utils.getDateDifference('d', coupon.couponStartDate, today);
            if (timeStartDay > 0) {
                res.status(200).json({
                    success: false,
                    message: 'Sorry! This coupon has has not opened yet. You can not apply right now.'
                });
            } else {
                const timeLeftDay = utils.getDateDifference('d', coupon.couponEndDate, today);
                if (timeLeftDay > 0) {
                    if(coupon.couponLimit > coupon.couponUsedByUser.length){
                        if(!coupon.couponUsedByUser.includes(userId, 0)){
                            const data = {
                                _id: coupon._id,
                                couponCode: coupon.couponCode,
                                couponType: coupon.couponType,
                                couponAmount: coupon.couponAmount,
                                couponDiscountType: coupon.couponDiscountType,
                                couponMinPurchase: coupon.couponMinPurchase,
                            }
                            res.status(200).json({
                                success: true,
                                data,
                                message: 'Success! This coupon is applied on your order '
                            });

                        } else {
                            res.status(200).json({
                                success: false,
                                message: 'Sorry! This coupon has already been used by you! '
                            });

                        }
                    } else {
                        res.status(200).json({
                            success: false,
                            message: 'Sorry! This coupon has exceeded it\'s limit '
                        });
                    }
                } else {
                    res.status(200).json({
                        success: false,
                        message: 'Sorry! This coupon is already expired!'
                    });
                }
            }

        } else {
            res.status(200).json({
                success: false,
                message: 'Sorry! This coupon does not exist!'
            });
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

 exports.useCoupon = async (req, res, next) => {

    // check limit

    const couponCode = req.params.couponCode;
    const userId = req.userData.userId;
    let coupon;
    let message = "";

    try {

        const couponCheck = await Coupon.findOne({couponCode: couponCode});

        if(couponCheck != null){

            if (new Date() < couponCheck.couponEndDate) {

                if(couponCheck.couponLimit > couponCheck.couponUsedByUser.length){

                    if(!couponCheck.couponUsedByUser.includes(userId, 0)){

                        coupon = couponCheck;

                        message = 'Coupon Added Successfully To Order!';

                    } else {

                        message = 'This Coupon Has Already Been Used By You!';

                    }

                } else {

                    message = 'This Coupon Has Exceeded It\'s Limit';

                }

            } else {

                message = 'This Coupon Has Either Expired Or Hasn\'t Started Yet';

            }

        } else {

            message = 'Coupon Does Not Exist!'

        }

        res.status(200).json({
            data: coupon,
            message: message
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

/**
 * Update Coupon Info After Order Confirmation
 */

exports.couponUsed = async (req, res, next) => {

    const couponId = req.body.couponId;
    const userId = req.userData.userId;

    try {

        await Coupon.findOneAndUpdate({_id: couponId}, {
            "$push": {
                couponUsedByUser: userId
            }
        });

        const coupon = await Coupon.findOne({_id: couponId});

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                usedCoupons: coupon._id
            }
        });

        res.status(200).json({
            message: 'Coupon Redeemed Successfully!'
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


//
