var openweatherKey = "314d4c34c1249870bc1906e6166f69d8";
var cityLat;
var cityLon;

$('#city-search-input').submit(handleSubmit)

function handleSubmit(event){
    event.preventDefault();

    var city = $('#city-input').val()

    getWeather(city)
}

function getWeather(cityName){
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openweatherKey}&units=imperial`;

    fetch(requestUrl)
        .then(function(response) {
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
            displayCurrentWeather(city, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi);
        })

}

function displayCurrentWeather(city, temp, windSpeed, humidity, uvIndex) {
    $('#city-name').text(city);
    $('#current-temp').text(temp);
    $('#current-wind-speed').text(windSpeed);
    $('#current-humidity').text(humidity)
    $('#current-uv-index').text(uvIndex)
}