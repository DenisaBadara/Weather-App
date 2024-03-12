document.addEventListener("DOMContentLoaded", (_event) => {
  let cityInput = document.querySelector('#cities');


  /**
   * Create and render the datalist element
   * @param  {Array} data  
   */
  function renderDatalist(data) {
    let datalist = document.getElementById('cities-data');
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = 'cities-data';
      cityInput.setAttribute('list', datalist.id);
      cityInput.after(datalist);
    }

    let fragment = document.createDocumentFragment();

    for (let city of data) {
      let option = document.createElement('option');
      option.textContent = city;
      fragment.append(option);
    }

    datalist.innerHTML = '';
    datalist.append(fragment);
  }

  /**
   * Fetch city suggestions from the Geoapify API
   * @param {string} searchText 
   */
  function fetchCitySuggestions(searchText) {
    if (searchText.length >= 3) {
      searchText = searchText.replace(/\s/g, '%60');
      let apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchText}&apiKey=3050cf52b4b749a199b5076aa9e585a8`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          let cities = data.features.map(feature => feature.properties.city);
          renderDatalist(cities);
        })
        .catch(error => console.error('Error fetching city suggestions:', error));
    } else {
      renderDatalist([]);
    }
  }


  cityInput.addEventListener('input', (event) => {
    let searchText = event.target.value;
    fetchCitySuggestions(searchText);
  });

  function loadData() {
    let cityName = cityInput.value;
    let apiKey = "71a603c806781b37428b78660f129df9";
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
     
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  let searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', loadData);

  let favoriteButton = document.getElementById('favoriteButton');
  favoriteButton.addEventListener('click', addFavoriteCity);
});
