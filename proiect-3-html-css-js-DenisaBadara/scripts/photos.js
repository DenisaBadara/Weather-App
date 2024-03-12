function setBodyBackground(imageUrl, opacity) {
    document.body.style.background = `url(${imageUrl}) center/cover no-repeat rgba(255, 255, 255, ${opacity})`;
}

function getCityImage(cityInput, opacity) {
    const pexelsApiKey = "MG8iUuUvKr4lBtoImTNmkje5wvgIr0iStkLHxn52Qix5BM7P6yVS9FZd";

    const searchUrl = `https://api.pexels.com/v1/search?query=${cityInput}&per_page=1`;

    fetch(searchUrl, {
        headers: {
            Authorization: pexelsApiKey,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.photos && data.photos.length > 0) {
            const imageUrl = data.photos[0].src.original;
            setBodyBackground(imageUrl, opacity);
        } else {
            console.error("No image found for the city");
        }
    })
    .catch((error) => {
        console.error("Error fetching image:", error);
    });
}

function loadData() {
    const cityInput = document.getElementById("cities").value;
    const opacity = 0.4; 
    getCityImage(cityInput, opacity);
}
