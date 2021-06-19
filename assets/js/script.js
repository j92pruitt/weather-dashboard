var openweatherKey = "314d4c34c1249870bc1906e6166f69d8";
var cityLat;
var cityLon;

$('#city-search-input').submit(handleSubmit)

displayStoredCities();

var DateTime = luxon.DateTime;

function handleSubmit(event){
    event.preventDefault();

    var city = $('#city-input').val()

    getWeather(city)
}

function getWeather(cityName){
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openweatherKey}&units=imperial`;

    fetch(requestUrl)
        .then(function(response) {
            // Error handling for user searching a city that does not exist. City will not be stored.
            if (response.status != 200) {
                return "No City"
            }

            storeCity(cityName)

            return response.json()
        })

        .then(function(data){
            // Error handling for user searching a city that does not exist. Second API call is not made.
            if (data === "No City") {
                console.log("Error Handled: No City by that name")
                return
            }

            // Weather endpoint is only used to get lat and lon.
            cityLat = data.coord.lat;
            cityLon = data.coord.lon;
            getOpenWeatherData(cityName,cityLat,cityLon)
        })
}

function getOpenWeatherData(city,lat, lon) {
    // Onecall endpoint is used to get weather information for dashboard.
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely,alerts&appid=${openweatherKey}`
    
    fetch(requestUrl)
        .then(function(response) {
            return response.json()
        })
        
        .then(function(data) {
            console.log(data)
            displayCurrentWeather(city, data);
            displayFiveDayForecast(data)
        })

}

// Sets values for all html elements related to current weather. 
function displayCurrentWeather(city, weather) {
    var currentDate = DateTime.fromSeconds(weather.current.dt).toLocaleString();
    var weatherIcon = weather.current.weather[0].icon

    $('#city-name').text(`${city} (${currentDate})`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${weatherIcon}.png`)
    $('#current-temp').html(`${weather.current.temp}<span>&#176;</span>F`);
    $('#current-wind-speed').text(`${weather.current.wind_speed} MPH`);
    $('#current-humidity').text(`${weather.current.humidity} %`)
    $('#current-uv-index').text(weather.current.uvi)
    setUvIndexColor(weather.current.uvi)
}

// Helper function for changing the uvi color indicator based on value.
function setUvIndexColor(uvi) {
    if (uvi <= 2){
        $('#current-uv-index').css({'background-color' : 'green'})
    } else if (uvi <= 5) {
        $('#current-uv-index').css({'background-color' : 'yellow'})
    } else if (uvi <= 7) {
        $('#current-uv-index').css({'background-color' : 'orange'})
    } else{
        $('#current-uv-index').css({'background-color' : 'red'})
    }
}

// Loop through 5-day forecast cards and populate them with html
function displayFiveDayForecast(weather) {
    var forecastArray = weather.daily;
    var index = 1;
    var forecast;

    $('#5-day-forecast').children('div').each(function(){
        forecast = forecastArray[index];
        generateForecastHtml($(this), forecast);
        index++
    })
}

// Generate html for a given forecast
function generateForecastHtml(card, forecast) {
    var date = DateTime.fromSeconds(forecast.dt).toLocaleString()
    var weatherIcon = forecast.weather[0].icon

    card.html(
        `
        <h4>${date}</h4>
        <img class="forecast-icon" src="https://openweathermap.org/img/wn/${weatherIcon}.png">
        <p>Temp: ${forecast.temp.day}<span>&#176;</span>F</p>
        <p>Wind: ${forecast.wind_speed} MPH</p>
        <p>Humidity: ${forecast.humidity} %</p>
        `
    )
}

// Stores a given city in local storage.
function storeCity(cityName) {
    var previousCities = JSON.parse(localStorage.getItem('previousCities'))
    if (previousCities) {
        if (!previousCities.includes(cityName)){
            previousCities.push(cityName);
            appendCityButton(cityName)
        }
    } else{
        previousCities = [cityName];
    }
    localStorage.setItem('previousCities', JSON.stringify(previousCities))
}

// Generates buttons for all previously searched cities in local storage.
function displayStoredCities() {
    var previousCities = JSON.parse(localStorage.getItem('previousCities'))

    if(previousCities === null){
        return
    }
    
    for (i = 0; i < previousCities.length; i++){
        var previousCity = previousCities[i];
        appendCityButton(previousCity)
    }
}

function appendCityButton(cityName){
    var button = $(`<a href="#" class="btn btn-secondary w-100 m-1">${cityName}</a>`)

    $('#previous-cities-list').append(
        button
    )

    button.click(recallForecast)
}

function recallForecast(event) {
    event.preventDefault();

    var cityName = $(this).text();

    getWeather(cityName);
}
