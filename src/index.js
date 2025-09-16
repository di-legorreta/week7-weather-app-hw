// @ts-check

function formatDate(date) {
   let minutes = date.getMinutes();
   let hours = date.getHours();
   if (minutes < 10) minutes = `0${minutes}`;
   if (hours < 10) hours = `0${hours}`;
   const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
   ];
   const day = days[date.getDay()];
   return `${day} ${hours}:${minutes}`;
}

function refreshWeather(response) {
   const d = response.data;

   if (!d || !d.temperature || typeof d.temperature.current !== "number") {
      alert("City not found. Try another spelling.");
      return;
   }

   const cityEl = document.querySelector("#weather-app-city");
   const tempEl = document.querySelector("#weather-app-temp-value");
   const descEl = document.querySelector("#description");
   const humidEl = document.querySelector("#humidity");
   const windEl = document.querySelector("#speed");
   const timeEl = document.querySelector("#time");
   const iconWrap = document.querySelector("#weather-app-icon");

   if (cityEl && d.city) cityEl.innerHTML = d.city;
   if (tempEl) tempEl.textContent = String(Math.round(d.temperature.current));
   if (descEl) descEl.innerHTML = d.condition.description;
   if (humidEl) humidEl.innerHTML = Math.round(d.temperature.humidity) + "%";
   if (windEl) windEl.innerHTML = Math.round(d.wind.speed) + "km/h";

   if (timeEl && d.time) {
      const ms = d.time < 1e12 ? d.time * 1000 : d.time;
      timeEl.innerHTML = formatDate(new Date(ms));
   }

   if (iconWrap && d.condition && d.condition.icon_url) {
      const iconUrl = d.condition.icon_url.replace("http://", "https://");
      iconWrap.innerHTML = `<img src="${iconUrl}" alt="${d.condition.description}" width="72" height="72">`;
   }
}

function searchCity(city) {
   const apiKey = "297bdob5643aebcfc422bc019b792eta";
   const apiUrl =
      "https://api.shecodes.io/weather/v1/current" +
      "?query=" +
      encodeURIComponent(city) +
      "&key=" +
      apiKey +
      "&units=metric";

   axios
      .get(apiUrl)
      .then(refreshWeather)
      .catch(function () {
         alert("City not found or network issue.");
      });
}

function handleSearchSubmit(event) {
   event.preventDefault();
   const input = document.querySelector("#search-input");
   const city = (input && input.value ? input.value : "").trim();
   if (!city) {
      alert("Please type a city");
      return;
   }

   const cityEl = document.querySelector("#weather-app-city");
   if (cityEl) cityEl.textContent = city;

   searchCity(city);
}

document
   .querySelector("#city-input")
   .addEventListener("submit", handleSearchSubmit);

searchCity("Paris");
