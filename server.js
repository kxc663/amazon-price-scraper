const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 8000;
const axios = require('axios');
const cheerio = require('cheerio');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));

amazonBaseUrl = "https://www.amazon.com/s?k="

app.get('/search', (req, res) => {
    const name = req.query.q;
    amazonProductUrl = amazonBaseUrl + name;
    // get the html from the amazon product url
    // parse the html to get the product name, picture, and price
    // return the product name, picture, and price
    let html;
    axios.get(amazonProductUrl)
        .then(response => {
            const $ = cheerio.load(response.data);
            $('.sg-col-20-of-24.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16').each((i, element) => {
                const productName = $(element).find('span.a-size-medium').text();
                const productPrice = $(element).find('span.a-price > span.a-offscreen').text()
                const productImage = $(element).find('img.s-image').attr('src');
                console.log('Product Name:', productName);
                console.log('Product Price:', productPrice);
                console.log('Product Image:', productImage);
            });
            // use the $ object to manipulate the HTML
        })
        .catch(error => {
            res.send("N/A");
            console.log(error);
        });

    //res.send(amazonProductUrl);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
