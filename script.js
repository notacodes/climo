const apiKey = process.env.API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const airQualityApiUrl = "http://api.openweathermap.org/data/2.5/air_pollution";

const searchBox = document.querySelector(".search");
const searchBtn = document.querySelector(".searchbar button");
const weatherIcon = document.querySelector(".date-container-weather img");
const searchLocation = document.querySelector(".searchLocation");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".Weather").style.display = "none";
  } else {
    var data = await response.json();

    document.querySelector(".search").placeholder = data.name;
    const weatherDescription = data.weather[0].description;
    document.querySelector(".weather-description").innerHTML =
      weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    document.querySelector(".location").innerHTML =
      data.name + ", " + data.sys.country;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    document.querySelector(".date").innerHTML = formattedDate;

    document.querySelector(".temperature").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector("#sunset").innerHTML = convertUnixToAMPM(
      data.sys.sunset
    );
    document.querySelector("#first-metric-sunrise-sunset").innerHTML =
      convertUnixToAMPM(data.sys.sunrise);
    document.querySelector("#visibility").innerHTML =
      (data.main.pressure / 1000).toFixed(2) +
      '<span class="units">km</span>';
    document.querySelector("#pressure").innerHTML =
      data.main.pressure + '<span class="units">hPa</span>';
    document.querySelector("#humidity").innerHTML =
      data.main.humidity + '<span class="units">%</span>';
    document.querySelector("#feels-like").innerHTML =
      Math.round(data.main.feels_like) + '<span class="units">°C</span>';

    weatherIcon.src = `images/type=${data.weather[0].icon}.svg`;
  }
}

async function checkCordslat(city) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
  );

  if (response.status == 404) {
    console.error("Stadt nicht gefunden");
  } else {
    var data = await response.json();
    if (!data.length) {
      console.error("Keine Koordinaten gefunden");
    } else {
      return data[0].lat;
    }
  }
}

async function checkCordslon(city) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
  );

  if (response.status == 404) {
    console.error("Stadt nicht gefunden");
  } else {
    var data = await response.json();
    if (!data.length) {
      console.error("Keine Koordinaten gefunden");
    } else {
      return data[0].lon;
    }
  }
}

async function checkAirQuality(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );

  if (response.status == 404) {
    console.error("Luftqualität nicht gefunden");
  } else {
    const data = await response.json();

    document.querySelector("#pm2_5").innerHTML =
      data.list[0].components.pm2_5.toFixed(1);
    document.querySelector("#so2").innerHTML =
      data.list[0].components.so2.toFixed(1);
    document.querySelector("#no2").innerHTML =
      data.list[0].components.no2.toFixed(1);
    document.querySelector("#o3").innerHTML =
      data.list[0].components.o3.toFixed(1);

    const aqi = data.list[0].main.aqi;
    const airQualityImage = document.querySelector("#air-quality-image");
    airQualityImage.src = `images/air-quality-index=${aqi}.svg`;
  }
}

searchBtn.addEventListener("click", async () => {
  const city = searchBox.value;
  await checkWeather(city);
  const lat = await checkCordslat(city);
  const lon = await checkCordslon(city);
  await checkAirQuality(lat, lon);
});

searchBox.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const city = searchBox.value;
    await checkWeather(city);
    const lat = await checkCordslat(city);
    const lon = await checkCordslon(city);
    await checkAirQuality(lat, lon);
  }
});

searchLocation.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        checkWeatherByCoords(lat, lon);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function convertUnixToAMPM(unixTime) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(unixTime * 1000);
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: userTimezone,
  };
  return date.toLocaleString("en-US", options).replace(" ", "");
}

async function updateWeatherAutomatically() {
  const defaultCity = "London";
  await checkWeather(defaultCity);
  const lat = await checkCordslat(defaultCity);
  const lon = await checkCordslon(defaultCity);
  await checkAirQuality(lat, lon);
}
async function checkWeatherByCoords(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".Weather").style.display = "none";
  } else {
    var data = await response.json();
    console.log(data);

    document.querySelector(".search").placeholder = data.name;
    const weatherDescription = data.weather[0].description;
    document.querySelector(".weather-description").innerHTML = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    document.querySelector(".location").innerHTML = data.name + ", " + data.sys.country;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    document.querySelector(".date").innerHTML = formattedDate;

    document.querySelector(".temperature").innerHTML =
        Math.round(data.main.temp) + "°C";
    document.querySelector("#sunset").innerHTML = convertUnixToAMPM(data.sys.sunset);
    document.querySelector("#first-metric-sunrise-sunset").innerHTML = convertUnixToAMPM(data.sys.sunrise);
    document.querySelector("#visibility").innerHTML = (data.main.pressure /1000).toFixed(2) + '<span class="units">km</span>';
    document.querySelector("#pressure").innerHTML = data.main.pressure + '<span class="units">hPa</span>';
    document.querySelector("#humidity").innerHTML = data.main.humidity + '<span class="units">%</span>';
    document.querySelector("#feels-like").innerHTML = Math.round(data.main.feels_like) + '<span class="units">°C</span>';

    if (data.weather[0].icon == "01d") {
      weatherIcon.src = "images/type=01d.svg";
    } else if (data.weather[0].icon == "02d") {
      weatherIcon.src = "images/type=02d.png";
    } else if (data.weather[0].icon === "03d") {
      weatherIcon.src = "images/type=03d.svg";
    } else if (data.weather[0].icon === "04d") {
      weatherIcon.src = "images/type=04d.svg";
    } else if (data.weather[0].icon === "09d") {
      weatherIcon.src = "images/type=09d.svg";
    }else if (data.weather[0].icon == "10d") {
      weatherIcon.src = "images/type=10d.svg";
    }else if (data.weather[0].icon == "11d") {
      weatherIcon.src = "images/type=11d.svg";
    }else if (data.weather[0].icon == "13d") {
      weatherIcon.src = "images/type=13d.svg";
    }else if (data.weather[0].icon == "50d") {
      weatherIcon.src = "images/type=50d.svg";
    }else if(data.weather[0].icon == "01n") {
      weatherIcon.src = "images/type=01n.svg";
    }else if (data.weather[0].icon == "02n") {
      weatherIcon.src = "images/type=02n.svg";
    } else if (data.weather[0].icon == "03n") {
      weatherIcon.src = "images/type=03n.svg";
    } else if (data.weather[0].icon == "04n") {
      weatherIcon.src = "images/type=04n.svg";
    } else if (data.weather[0].icon == "09n") {
      weatherIcon.src = "images/type=09n.svg";
    }else if (data.weather[0].icon == "10n") {
      weatherIcon.src = "images/type=10n.svg"}
    else if (data.weather[0].icon == "11n") {
      weatherIcon.src = "images/type=11n.svg"}
    else if (data.weather[0].icon == "13n") {
      weatherIcon.src = "images/type=13n.svg"}
    else if (data.weather[0].icon == "50n") {
      weatherIcon.src = "images/type=50n.svg"}
  }
  checkAirQuality(lat, lon);
}

updateWeatherAutomatically();

