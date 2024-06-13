const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    link: { type: String, unique: true },
    title: String,
    articleTime: String,
    articleMark: String
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
