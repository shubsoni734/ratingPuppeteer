const axios = require('axios');
const cheerio = require('cheerio');

const finalRatingList = async (tournamentid, round) => {
    try {
        const url = `https://chess-results.com/${tournamentid}.aspx?lan=1&art=1&rd=${round}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const rows = $('.CRs1 tr');  // Select all rows within the table with class 'CRs1'

        const data = [];
        rows.each((index, row) => {
            const cells = $(row).find('td');

            if (index === 0 || cells.length < 4) {
                return;
            }

            const rank = $(cells[0]).text().trim();
            const name = $(cells[3]).text().trim();
            const city = $(cells[6]).text().trim();
            let pts = $(cells[7]).text().trim();

            pts = pts.replace(/,/g, '.');
            data.push({
                rank: rank,
                name: name,
                city: city,
                pts: pts
            });
        });
        if (data.length > 0) {
            return data;
        } else {
            return [];
        }
        // console.log(data);
        // return { status: 200, message: "Rating Scraping Successfully", data: data }
    } catch (e) {
        console.error(e);
        return { status: 500, error: e, message: "Error in scraping data from web" };
    }
};

const finalRanking = async (req, res) => {
    const { tournamentid, round } = req.params;
    const ratings = await finalRatingList(tournamentid, round);
    res.json(ratings);
}

module.exports = { finalRanking };