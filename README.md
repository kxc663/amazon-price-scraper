# amzon-price-scraper
## Instruction:
Link to website: [https://amzon-price-scraper.onrender.com/](https://amzon-price-scraper.onrender.com/)

## Write up:
### What?
An Amazon price scraper is a tool or software that extracts pricing information and other relevant data from Amazon's website to help users monitor and analyze product prices more effectively. This type of software can gather various data points, such as the product name, product images, current price, and historical price information. It then presents this information in an organized and user-friendly manner by using tables and charts for easy visualization and interpretation.

### Why?
While Amazon offers millions of products for sale, keeping track of price fluctuations and finding the best deals can be challenging for consumers. 
- Price tracking: Users can monitor the prices of specific items over time, allowing them to identify the best time to buy, take advantage of discounts, or wait for prices to drop.
- Price analysis: By collecting pricing data from Amazon, users can analyze trends and patterns, which can be valuable for market research and business intelligence purposes.
- Price monitor: Business person can use amazon price scraper to monitor the prices of competitors' products to ensure their pricing remains competitive and adjust prices based on market conditions.

### For whom? Who cares?
An Amazon price scraper can be beneficial for various individuals and businesses, as it helps make informed purchasing decisions and keeps track of market trends. 

### What's next?
- Add a wish list feature: allow user to add product to the wish list and track the price for those products. Also, the website can provide an option for users to set price thresholds, so they can receive alerts when the product price drops below their desired amount.
- Product comparison: get price data for the same product from different websites, such as BestBuy, Ebay, etc., which allows users to compare prices, specifications, and features of multiple products side-by-side, helping them choose the best option.
- Improve the speed and avoid 'too many requests' errors

### Why I choose not to extend Project 1
**Pros:**
- The current functionality of the website is comprehensive, providing most of the essential features users require. Expanding further might not yield significant benefits in terms of user experience.
- Improving the download speed would necessitate upgrades to the server equipment, which may be costly to implement since I am using the free server right now.
- To access higher resolution videos, users are required to sign in to Bilibili. As a result, you cannot directly scrape high-resolution video URLs from the website without compromising user privacy and security.
- All of the aforementioned points suggest that extending Project 1 may lead to numerous difficulties. Therefore, initiating a new project would be a better solution to avoid these issues.

**Cons:**
- The website for Project 1 may only offer basic downloading functionality as some advanced features, such as history, favorites, and the ability to change download resolution, may not be available.
- The development direction for Project 2 may require additional consideration as it may not be necessary for directly extending Project 1.

## How to test locally
1. Download node.js
2. `git clone git@github.com:kxc663/amzon-price-scraper.git`
3. `npm install`
4. `npm start`
5. Open site with url: [localhost:8000/](localhost:8000/)

## Screenshots
### Home Page
- Use the url at the beginning to open the page in the broswer and you can get the following home page
![Home Page](https://github.com/kxc663/amzon-price-scraper/blob/main/screenshots/Home.png)
### Search Box
- Type in the product you would like to search on Amazon and click on 'Search' button
![Search Box](https://github.com/kxc663/amzon-price-scraper/blob/main/screenshots/Search.png)
### Search Result Page
- The search results will be presented in a table format (including name with link to amazon, image, current price, history lowest price, and history price chart button). Please allow the server some additional time to retrieve the historical pricing information and create a chart
![Search Result](https://github.com/kxc663/amzon-price-scraper/blob/main/screenshots/Result.png)
### History Price Chart Page
- To access the chart page, click on the green chart button located on the far right of each row in the table. The chart page will resemble the following format
![History Price](https://github.com/kxc663/amzon-price-scraper/blob/main/screenshots/Chart.png)

## Reference:
- Price detail: https://amazon.com/
- Amazon Logo: https://en.wikipedia.org/wiki/File:Amazon_logo.svg
- Button image: https://www.freepik.com/
- Background: https://www.wallpaperflare.com/
- Loading gif: https://tenor.com/view/loading-gif-26347469
