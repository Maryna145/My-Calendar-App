import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxLength: 60,
    },
    intervalStudy: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: "#00a3ff",
    },
}, {
    timestamps: true
});

export default mongoose.model('Event', eventSchema);