const amazonResultBaseUrl = "https://www.amazon.com/"
const priceMap = new Map();

$("#nextPage").click(async function (){
    const searchName = $("#searchInput").val().trim();
    const pageNum = await $.get("/page", {page: "next"});
    console.log(pageNum);
});

$("#previousPage").click(async function (){
    const searchName = $("#searchInput").val().trim();
    const pageNum = await $.get("/page", {page: "previous"});
    console.log(pageNum);
});

$("#searchButton").click(async function () {
    $("#displayTable tbody").empty();
    const searchName = $("#searchInput").val().trim();
    if (searchName === "") {
        alert("Please enter a name");
    } else {
        const response = await $.get("/search", { q: searchName });
        if (response === "N/A") {
            alert("No product found with this name.");
            return;
        } else if (response.error) {
            throw new Error(response.error);
        } else {
            generateTable(response);
            console.log("success");
        }
    }
});

$(".pop-up span").click(function () {
    $("#pop-up").hide();
});

async function generateTable(dataSet) {
    $("#displayTable").show();
    const tableBody = document.getElementById("tableBody");
    for (var i = 0; i < dataSet.length; i++) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const name = dataSet[i][0];
        nameCell.classList.add('product-name');
        nameCell.innerHTML = `<a href="${amazonResultBaseUrl}${dataSet[i][1].url}" target="_blank">${name}</a>`;
        row.appendChild(nameCell);
        const imageCell = document.createElement("td");
        const imageElement = document.createElement("img");
        await loadImage(dataSet[i][1].image, imageElement);
        imageElement.alt = "product image";
        imageElement.width /= 2;
        imageElement.height /= 2;
        imageCell.appendChild(imageElement);
        row.appendChild(imageCell);
        const priceCell = document.createElement("td");
        const price = removeExtraDollarSign(dataSet[i][1].price);
        priceCell.innerHTML = price;
        row.appendChild(priceCell);
        const lowestPriceCell = document.createElement("td");
        const lowestPrice = await $.get("/lowestPrice", { id: dataSet[i][1].id, name: dataSet[i][0] });
        let current;
        let history;
        if(lowestPrice[0] != null){
            history = parseInt(lowestPrice[0].replace(/[^\d.]/g, ''), 10);
        } else{
            history = Infinity;
        }
        if(price != null){
            current = parseInt(price.replace(/[^\d.]/g, ''), 10)
        } else{
            current = Infinity;
        }
        if(current >= history){
            lowestPriceCell.innerHTML = lowestPrice[0];
        } else {
            lowestPriceCell.innerHTML = "Best Price all-time"
        }
        priceMap.set(dataSet[i][1].id, lowestPrice);
        row.appendChild(lowestPriceCell);
        const historyButton = document.createElement("button");
        historyButton.innerHTML = "See Price Trend";
        historyButton.classList.add("history-button");
        historyButton.id = dataSet[i][1].id;
        historyButton.addEventListener("click", async function () {
            const chartSrc = priceMap.get(this.id)[1];
            $("#pop-up").show();
            $("#pop-up-image").attr("src", chartSrc);
        });
        const historyCell = document.createElement("td");
        historyCell.appendChild(historyButton);
        row.appendChild(historyCell);
        tableBody.appendChild(row);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

function removeExtraDollarSign(priceString) {
    var dollarSignCount = 0;
    for (var i = 0; i < priceString.length; i++) {
        if (priceString[i] === "$") {
            dollarSignCount++;
        }
    }
    if (dollarSignCount > 1) {
        const priceRegex = /\$([0-9]+,?[0-9]*\.[0-9]{2})/;
        const priceMatch = priceString.match(priceRegex);
        return priceMatch[0];
    }
    return priceString;
}

async function loadImage(url, elem) {
    return new Promise((resolve, reject) => {
        elem.onload = () => resolve(elem);
        elem.onerror = reject;
        elem.src = url;
    });
}
