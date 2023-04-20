$("#searchButton").click(async function () {
    const searchName = $("#searchInput").val().trim();
    if (searchName === "") {
        alert("Please enter a name");
    } else {
        const response = await $.get("/search", { q: searchName });
        if (response === "Not Found") {
            alert("No product found with this name.");
            return;
        } else if (response.error) {
            throw new Error(response.error);
        } else {
            console.log(response);
            console.log("success");
        }
    }
});