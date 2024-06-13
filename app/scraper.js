const axios = require('axios');
const cheerio = require('cheerio');
const News = require('./models');

const scrapeNews = async (pageNumber) => {
    const url = `https://informburo.kz/novosti?page=${pageNumber}`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const newsItems = [];

        $('.uk-grid').each((index, element) => {
            const link = $(element).find('a').attr('href');
            const title = $(element).find('a').text().trim();
            const articleTime = $(element).find('.article-time').text().trim();
            const articleMark = $(element).find('.article-mark').text().trim();

            if (link && title && articleTime && articleMark) {
                newsItems.push({
                    link: `https://informburo.kz${link}`,
                    title,
                    articleTime,
                    articleMark
                });
            }
        });

        for (const item of newsItems) {
            try {
                // Check if the news item already exists
                const exists = await News.findOne({ link: item.link });
                if (!exists) {
                    await News.create(item);
                } else {
                    console.log(`Duplicate entry found for link: ${item.link}`);
                }
            } catch (error) {
                if (error.code === 11000) {
                    // Duplicate key error, ignore
                    console.log(`Duplicate entry found for link: ${item.link}`);
                } else {
                    console.error(`Error inserting item: ${error.message}`);
                }
            }
        }

        console.log(`Page ${pageNumber} data processed.`);
    } catch (error) {
        console.error(`Error scraping page ${pageNumber}:`, error);
    }
};

const scrapeMultiplePages = async (numPages) => {
    for (let i = 1; i <= numPages; i++) {
        await scrapeNews(i);
    }
};

module.exports = scrapeMultiplePages;
