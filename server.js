const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const { promises } = require('dns');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));

amazonBaseUrl = "https://www.amazon.com/s?k="
camelBaseUrl = "https://camelcamelcamel.com/product/"

app.get('/search', (req, res) => {
    const name = req.query.q;
    amazonProductUrl = amazonBaseUrl + name;
    // get the html from the amazon product url
    // parse the html to get the product name, picture, and price
    // return the product name, picture, and price
    axios.get(amazonProductUrl)
        .then(response => {
            const $ = cheerio.load(response.data);
            const products = new Map();
            $('.sg-col-20-of-24.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16').each((i, element) => {
                const productName = $(element).find('span.a-size-medium').text();
                const productPrice = $(element).find('span.a-price > span.a-offscreen').text()
                const productImage = $(element).find('img.s-image').attr('src');
                const productID = $(element).attr('data-asin');
                const productURL = $(element).find('a.a-link-normal.a-text-normal').attr('href');
                products.set(productName, {
                    price: productPrice,
                    image: productImage,
                    id: productID,
                    url: productURL
                });
            });
            if(products.size === 0) {
                $('.sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.s-widget-spacing-small.sg-col-4-of-20').each((i, element) => {
                    const productName = $(element).find('span.a-size-base-plus').text();
                    const productPrice = $(element).find('span.a-price > span.a-offscreen').text()
                    const productImage = $(element).find('img.s-image').attr('src');
                    const productID = $(element).attr('data-asin');
                    const productURL = $(element).find('a.a-link-normal.a-text-normal').attr('href');
                    products.set(productName, {
                        price: productPrice,
                        image: productImage,
                        id: productID,
                        url: productURL
                    });
                }); 
            }
            res.json([...products]);
        })
        .catch(error => {
            res.send("N/A");
            console.log(error);
        });
});

app.get('/lowestPrice', async (req, res) => {
    const productID = req.query.id;
    const camelProductUrl = camelBaseUrl + productID;
    axios.get(camelProductUrl)
        .then(response => {
            const $ = cheerio.load(response.data);
            const price = $('.lowest_price').text();
            res.send(extractPrice(price));
        })
        .catch(error => {
            console.log(error);
            res.send("N/A");
        });
});


function extractPrice(str) {
    const regex = /(\$[\d,]+\.\d+)/;
    const match = regex.exec(str);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
