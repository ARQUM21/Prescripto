import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const counterModel = mongoose.models.counter || mongoose.model('counter', counterSchema);

export default counterModel;