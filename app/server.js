const scrapeMultiplePages = require('./scraper');
const News = require('./models');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const numPages = process.env.NUM_PAGES || 2;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

cron.schedule('* * * * *', async () => {
    console.log('Running a task every minute');
    await scrapeMultiplePages(numPages);
});

app.get('/scrape', async (req, res) => {
    await scrapeMultiplePages(numPages);
    res.send(`Scraping done for ${numPages} pages!`);
});

app.get('/news', async (req, res) => {
    const news = await News.find();
    res.json(news);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
