const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));

amazonBaseUrl = "https://www.amazon.in/s?k="

app.get('/search', (req, res) => {
    const name = req.query.q;
    amazonProductUrl = amazonBaseUrl + name;
    res.send(amazonProductUrl);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
