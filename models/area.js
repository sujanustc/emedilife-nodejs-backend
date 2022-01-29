const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    readOnly: {
        type: Boolean,
        required: false
    },
    area: {
        type: String,
        required: true
    },
    areabn: {
        type: String,
        required: false
    },
    coordinates: {
        type: String,
        required: false
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: 'District'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Area', schema);