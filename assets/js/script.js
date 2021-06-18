var openweatherKey = "314d4c34c1249870bc1906e6166f69d8";
var cityLat;
var cityLon;

$('#city-search-input').submit(handleSubmit)

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
            storeCity(cityName)
            return response.json()
        })

        .then(function(data){
            cityLat = data.coord.lat;
            cityLon = data.coord.lon;
            getOpenWeatherData(cityName,cityLat,cityLon)
        })
}

function getOpenWeatherData(city,lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely,alerts&appid=${openweatherKey}`
    
    fetch(requestUrl)
        .then(function(response) {
            return response.json()
        })
        
        .then(function(data) {
            console.log(data);
            displayCurrentWeather(city, data);
            displayFiveDayForecast(data)
        })

}

function displayCurrentWeather(city, weather) {
    var currentDate = DateTime.fromSeconds(weather.current.dt).toLocaleString();
    var weatherIcon = weather.current.weather[0].icon

    $('#city-name').text(`${city} (${currentDate})`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${weatherIcon}.png`)
    $('#current-temp').text(weather.current.temp);
    $('#current-wind-speed').text(weather.current.wind_speed);
    $('#current-humidity').text(weather.current.humidity)
    $('#current-uv-index').text(weather.current.uvi)
}

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

function generateForecastHtml(card, forecast) {
    var date = DateTime.fromSeconds(forecast.dt).toLocaleString()
    var weatherIcon = forecast.weather[0].icon

    card.html(
        `
        <h4>${date}</h4>
        <img class="forecast-icon" src="https://openweathermap.org/img/wn/${weatherIcon}.png">
        <p>Temp: ${forecast.temp.day}</p>
        <p>Wind: ${forecast.wind_speed}</p>
        <p>Humidity: ${forecast.humidity}</p>
        `
    )
}

function storeCity(cityName) {
    var previousCities = JSON.parse(localStorage.getItem('previousCities'))
    if (previousCities) {
        if (!previousCities.includes(cityName)){
            previousCities.push(cityName);
        }
    } else{
        previousCities = [cityName];
    }
    localStorage.setItem('previousCities', JSON.stringify(previousCities))
}

function displayStoredCities() {
    
}
