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

amazonBaseUrl = "https://www.amazon.com/s?k=";
amazonPage = "&page=";
camelBaseUrl = "https://camelcamelcamel.com/product/";
chartBaseUrl = "https://charts.camelcamelcamel.com/us/";
chartConfig_new = "/amazon.png?force=1&zero=0&w=725&h=440&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en";
chartConfig_used = "/amazon-new-used.png?force=1&zero=0&w=855&h=513&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en";

let currentPage = 1;

// Decrease the possiblilty of getting blocked by Amazon
// Note: this is not a guarantee that you will not get blocked by Amazon since Amazon can still block you based on your IP address
const config = {
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        "cookie": 'session-id=132-5124472-2562003; session-id-time=2082787201l; i18n-prefs=USD; skin=noskin; ubid-main=130-4010729-2819465; session-token="UyeJ80rEwKpnRsCSq31OYKe/2mveP9mW+8cVhqiw1zfSv00E4zqBjLBvMeqlnCU9136SOK8+i8Vwo8hzWRVDkzNBmXNwcxvZtp7mh1rnoZwA67x+JmL0Nxr/yYkEHFJQIAxAW+CbF00EBomOajU5Nk+DF/Dk51Ot96yCHvDrsc9AwUl9yJuqn5OmTrUPrs8LTsAEcG/GkjqRyLN9j+ATm0WX9AMjDlS2K2yd6DmEzfY='
    }
}

app.get('/search', (req, res) => {
    const name = req.query.q;
    amazonProductUrl = amazonBaseUrl + name + amazonPage + currentPage;
    console.log(amazonProductUrl);
    // get the html from the amazon product url
    // parse the html to get the product name, picture, and price
    // return the product name, picture, and price
    axios.get(amazonProductUrl, config)
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
            if (products.size === 0) {
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
    const name = req.query.name;
    const camelProductUrl = camelBaseUrl + productID;
    axios.get(camelProductUrl)
        .then(response => {
            const $ = cheerio.load(response.data);
            const price = $('.lowest_price').text();
            let priceChartUrl = "";
            if (!name.includes("(Renewed)")) {
                priceChartUrl = chartBaseUrl + productID + chartConfig_new;
            } else {
                priceChartUrl = chartBaseUrl + productID + chartConfig_used;
            }
            res.send([extractPrice(price), priceChartUrl]);
        })
        .catch(error => {
            console.log(error);
            res.send("N/A");
        });
});

app.get('/page', async (req, res) => {
    const pageOperation = req.query;
    if (pageOperation.page == "next") {
        currentPage += 1;
        res.send(currentPage.toString());
        console.log(currentPage);
    } else if (currentPage > 1 && pageOperation.page == "previous") {
        currentPage -= 1;
        res.send(currentPage.toString());
        console.log(currentPage);
    }
    console.log(pageOperation, currentPage);
});

app.get('/reset', async (req, res) => {
    currentPage = 1;
    res.send(currentPage.toString());
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
