const puppeteer = require("puppeteer");
require("dotenv").config();

// Define the findRating function
const findRating = async (id) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.goto(`https://ratings.fide.com/profile/${id}`);

    const standardRating = await page.evaluate(() => {
      const div = document.querySelector('.profile-top-rating-data_gray');
      if (div) {
        const text = div.textContent.trim();
        const rating = text.split('\n')[1].trim();
        return rating;
      } else {
        return "Div element not found";
      }
    });

    const rapidRating = await page.evaluate(() => {
      const div = document.querySelector('.profile-top-rating-data_red');
      if (div) {
        const text = div.textContent.trim();
        const rating = text.split('\n')[1].trim();
        return rating;
      } else {
        return "Div element not found";
      }
    });

    const blitzRating = await page.evaluate(() => {
      const div = document.querySelector('.profile-top-rating-data_blue');
      if (div) {
        const text = div.textContent.trim();
        const rating = text.split('\n')[1].trim();
        return rating;
      } else {
        return "Div element not found";
      }
    });

    return { std: standardRating, rapid: rapidRating, blitz: blitzRating };
  } catch (e) {
    console.error(e);
    return { std: "Error", rapid: "Error", blitz: "Error" };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Updated scrapeLogic function to use findRating
const scrapeLogic = async (req, res) => {
  const ratingId = req.params.id; // Extract ID from request parameters

  try {
    // Call the findRating function with the provided ID
    const ratings = await findRating(ratingId);

    // Format the result
    // const logStatement = `Standard Rating: ${ratings.std}\n` +
    //   `Rapid Rating: ${ratings.rapid}\n` +
    //   `Blitz Rating: ${ratings.blitz}`;
    const jsonResponse = {
      standardRating: ratings.std,
      rapidRating: ratings.rapid,
      blitzRating: ratings.blitz
    };
    console.log(logStatement);
    // res.send(logStatement);
    res.json(jsonResponse);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  }
};

module.exports = { scrapeLogic };
