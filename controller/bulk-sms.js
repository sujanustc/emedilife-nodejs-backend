const request = require('request');


exports.sendBulkSms = async (req, res, next) => {

    try {
        const message = req.body.message;
        const phoneNo = req.body.phoneNo;

        const url = 'http://66.45.237.70/api.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message;
        // const url = 'http://66.45.237.70/maskingapi.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message + '&senderid=' + process.env.bulkSmsSenderId;

        // console.log(url)
        let result = '';
        let options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        request(options, function (error, response) {
            if (error) {
                // console.log(error)
                result = error;
            }
            if (response && response.body) {
                result = response.body;
            }
            // console.log(response)
        });

        res.status(200).json({
            success: true,
            message: 'Success',
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
