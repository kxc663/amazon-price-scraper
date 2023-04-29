const amazonResultBaseUrl = "https://www.amazon.com/"
let isSuccess = false;
let firstSearch = true;
let currentPage = 1;
$("#nextPage").click(async function () {
    if (isSuccess) {
        //window.location.reload();
        isSuccess = false;
        currentPage = await $.get("/page", { page: "next" });
        $("#currentPage").text("Page " + currentPage);
        search();
    } else {
        alert("Please wait the page to completely load before switching page!")
    }

});

$("#previousPage").click(async function () {
    if (isSuccess) {
        //window.location.reload();
        isSuccess = false;
        currentPage = await $.get("/page", { page: "previous" });
        $("#currentPage").text("Page " + currentPage);
        search();
    } else {
        alert("Please wait the page to completely load before switching page!")
    }
});

$("#searchButton").click(async function () {
    if(firstSearch){
        firstSearch = false;
    }
    isSuccess = false;
    currentPage = 1;
    $("#currentPage").text("Page " + currentPage);
    await $.get("/reset");
    search();
});

$(".pop-up span").click(function () {
    $("#pop-up").hide();
});

async function generateTable(dataSet) {
    $("#displayTable").show();
    const tableBody = document.getElementById("tableBody");
    const priceMap = new Map();
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
        priceMap.set(dataSet[i][1].id, price);
        priceCell.innerHTML = price;
        row.appendChild(priceCell);
        tableBody.appendChild(row);
        const lowestPriceCell = document.createElement("td");
        lowestPriceCell.innerHTML = "<img src='./img/Loading.gif' alt='loading' width='50' height='50'>";
        lowestPriceCell.id = "lowestPrice" + i;
        row.appendChild(lowestPriceCell);
        const historyCell = document.createElement("td");
        historyCell.id = "history" + i;
        row.appendChild(historyCell);
    }
    $("#pageSwitchArea").show();
    $(".copyright").css({
        "padding-top": "40px"
    });
    generateHistory(dataSet, priceMap);
}

async function generateHistory(dataSet, priceMap) {
    for (var i = 0; i < dataSet.length; i++) {
        const lowestPrice = await $.get("/lowestPrice", { id: dataSet[i][1].id, name: dataSet[i][0] });
        const lowestPriceCell = document.getElementById("lowestPrice" + i);
        let current;
        let history;
        const price = priceMap.get(dataSet[i][1].id);
        if (lowestPrice[0] != null) {
            history = parseInt(lowestPrice[0].replace(/[^\d.]/g, ''), 10);
        } else {
            history = Number.MAX_VALUE;
        }
        if (price != null) {
            current = parseInt(price.replace(/[^\d.]/g, ''), 10)
        } else {
            current = -Number.MAX_VALUE;
        }
        if (current >= history) {
            lowestPriceCell.innerHTML = lowestPrice[0];
        } else {
            lowestPriceCell.innerHTML = "Best Price all-time"
        }
        const historyButton = document.createElement("button");
        historyButton.innerHTML = "<img src='./img/chartBtn.png' style='width: 50px'>";
        historyButton.classList.add("history-button");
        historyButton.id = dataSet[i][1].id;
        historyButton.addEventListener("click", async function () {
            const chartSrc = lowestPrice[1];
            $("#pop-up").show();
            $("#pop-up-image").attr("src", chartSrc);
        });
        const historyCell = document.getElementById("history" + i);
        historyCell.appendChild(historyButton);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    isSuccess = true;
}

async function search() {
    $("#displayTable tbody").empty();
    const searchName = $("#searchInput").val().trim();
    console.log(searchName);
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
        }
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

setInterval(function () {
    if (currentPage == 1) {
        $("#previousPage").prop("disabled", true);
    } else{
        $("#previousPage").prop("disabled", false);
    }
    if(isSuccess || firstSearch){
        $("#searchButton").prop("disabled", false);
    } else {
        $("#searchButton").prop("disabled", true);
    }
}, 1000);
