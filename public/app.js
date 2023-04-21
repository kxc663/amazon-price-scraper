const amazonResultBaseUrl = "https://www.amazon.com/"

$("#searchButton").click(async function () {
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
            console.log(response.length);
            console.log("success");
        }
    }
});

async function generateTable(dataSet) {
    $("#displayTable").show();
    console.log(dataSet);
    const tableBody = document.getElementById("tableBody");
    for (var i = 0; i < dataSet.length; i++) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const name = dataSet[i][0];
        nameCell.classList.add('product-name');
        nameCell.innerHTML = `<a href="${amazonResultBaseUrl}${dataSet[i][1].url}">${name}</a>`;
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
        const lowestPrice = await $.get("/lowestPrice", { id: dataSet[i][1].id });
        console.log(lowestPrice);
        lowestPriceCell.innerHTML = lowestPrice;
        row.appendChild(lowestPriceCell);
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
