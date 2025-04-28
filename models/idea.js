const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', IdeaSchema);