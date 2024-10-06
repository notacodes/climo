const apiKey = "8bd4fbc98ef565a9eb2b93540b25bf9e";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

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
    console.log(data);

    document.querySelector(".location").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector("#humidity").p = data.main.humidity;
    document.querySelector("#feels-like").p = data.main.feels_like + "°C";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    }
  }
};

async function checkWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".Weather").style.display = "none";
      } else {
        var data = await response.json();
        console.log(data);
    
        document.querySelector(".search").placeholder = data.name;
        document.querySelector(".weather-description").innerHTMLy = data.weather[0].description;
        document.querySelector(".location").innerHTML = data.name + ", " + data.sys.country;
        
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        document.querySelector(".date").innerHTML = formattedDate;

    document.querySelector(".temperature").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector("#visibility").innerHTML = (data.main.pressure /1000).toFixed(2) + "km";
    document.querySelector("#pressure").innerHTML = data.main.pressure + "hPa";
    document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
    document.querySelector("#feels-like").innerHTML = Math.round(data.main.feels_like) + "°C";

        if (data.weather[0].icon == "01d") {
          weatherIcon.src = "images/type=01d.svg";
        } else if (data.weather[0].icon == "02d") {
          weatherIcon.src = "images/type=02d.svg";
        } else if (data.weather[0].icon == "03d") {
          weatherIcon.src = "images/type=03d.svg";
        } else if (data.weather[0].icon == "04d") {
          weatherIcon.src = "images/type=04d.svg";
        } else if (data.weather[0].icon == "09d") {
          weatherIcon.src = "images/type=09d.svg";
        }else if (data.weather[0].icon == "10d") {
          weatherIcon.src = "images/type=10d.svg";
        }else if (data.weather[0].icon == "11d") {
          weatherIcon.src = "images/type=11d.svg";
        }else if (data.weather[0].icon == "13d") {
          weatherIcon.src = "images/type=13d.svg";
        }else if (data.weather[0].icon == "50d") {
          weatherIcon.src = "images/type=50d.svg";
        }
      }

};



searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchLocation.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log("Latitude is :", lat, "Longitude is :", lon);
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
