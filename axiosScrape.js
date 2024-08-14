const axios = require('axios');
const cheerio = require('cheerio');

const findRating = async (id) => {
    try {
        const url = `https://ratings.fide.com/profile/${id}`;
        console.log(url);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const standardRating = $('.profile-top-rating-data_gray').text().trim().split('\n')[1]?.trim() || "Div element not found";
        const rapidRating = $('.profile-top-rating-data_red').text().trim().split('\n')[1]?.trim() || "Div element not found";
        const blitzRating = $('.profile-top-rating-data_blue').text().trim().split('\n')[1]?.trim() || "Div element not found";

        return { std: standardRating, rapid: rapidRating, blitz: blitzRating };
    } catch (e) {
        console.error(e);
        return { std: "Error", rapid: "Error", blitz: "Error" };
    }
};

const axiosScrape = async (req, res) => {
    const { url } = req.params;
    const ratings = await findRating(url);
    res.json(ratings);
}

module.exports = { axiosScrape };