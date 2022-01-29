const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
{
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        comment: "Home/Office/Other"
    },
    districtId: {
        type: Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('DeliveryAddress', schema);
