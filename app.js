const button = document.getElementById("button");
const input = document.getElementById("input");
const resultDiv = document.getElementById("results");
const background = document.querySelector(".weather-app");
const additionalInfo = document.getElementById("additional_info");

button.addEventListener("click", checkWeather);
document.addEventListener("DOMContentLoaded", checkWeather);

// funkcija koja dohvaca podatke o vremenu
async function checkWeather(e) {
  e.preventDefault();
  // kad se funkcija pokrene, default prikazani grad je Rijeka
  let city = input.value ? input.value : "Rijeka";
  let data = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=9e31c87e2cf54a83be093059220207&q=${city}&aqi=yes`
  );
  data = await data.json();
  writeData(data);
}

// funkcija koja ispisuje podatke o vremenu u html
function writeData(data) {
  // ako nema podataka ispisuje se ovo
  if (data.error) {
    resultDiv.innerHTML = `<h5 class="no_data">no data for  ${input.value}</h5>`;
    additionalInfo.innerHTML = `      <div class="more_information">
<ul class="info_items">
  <li><i class="fa-solid fa-droplet"></i> Currenty Humidity: No data</li>
  <li><i class="fa-solid fa-temperature-half"></i> Feels like: No data </li>
  <li><i class="fa-solid fa-wind"></i> Wind: No data</li>
</ul>
</div>`;
  }
  // u suprotnom se izvršava sve ovo ispod
  else {
    const nightOrDay = data.current.is_day === 1 ? "day" : "night"; // ako je dan vraća "day" u suprotnom "night" u konstantu nightOrDay
    const cityName = data.location.name; // ime grada
    const currentTemp = data.current.temp_c; // trenutna temperatura
    const conditionImg = data.current.condition.icon; // slika za trenutno vrijeme
    const conditionText = data.current.condition.text; // tekst za trenutno vrijeme
    const currentHumidity = data.current.humidity; // trenutna vlaga
    const feelsLike = data.current.feelslike_c; // očekivana temperatura
    const currentWind = data.current.wind_kph; // trenutni vjetar
    const randomNumber = Math.floor(Math.random() * 5) + 1; //random broj do 5 za sliku
    const localTime = data.location.localtime; // trenutno vrijeme

    // ako je vani sunčano, postavlja se slika za vrijeme sa suncem
    if (data.current.condition.code === 1000) {
      let currentCondition = "sunny";
      switch (nightOrDay) {
        // ako je dan
        case "day": {
          background.style.backgroundImage = `url(${getPicture(
            currentCondition,
            nightOrDay,
            randomNumber
          )})`;
          break;
        }
        // ako je noć
        case "night": {
          background.style.backgroundImage = `url(${getPicture(
            currentCondition,
            nightOrDay,
            1
          )})`;
          break;
        }
      }
    }
    // ako je vani oblačno, postavlja se slika za vrijeme sa oblacima
    else if (
      data.current.condition.code >= 1003 &&
      data.current.condition.code <= 1030
    ) {
      let currentCondition = "cloudy";
      switch (nightOrDay) {
        case "day": {
          background.style.backgroundImage = `url(${getPicture(
            currentCondition,
            nightOrDay,
            1
          )})`;
          break;
        }
        case "night": {
          background.style.backgroundImage = `url(${getPicture(
            currentCondition,
            nightOrDay,
            1
          )})`;
          break;
        }
      }
    }
    // ako je vani kiša, postavka sliku za vrijeme sa kišom
    else if (
      (data.current.condition.code >= 1031 &&
        data.current.condition.code <= 1201) ||
      (data.current.condition.code >= 1240 &&
        data.current.condition.code <= 1249)
    ) {
      let currentCondition = "rainy";
      switch (nightOrDay) {
        case "day": {
          background.style.backgroundImage = `url(${getPicture(
            currentCondition,
            nightOrDay,
            1
          )})`;
          break;
        }
        case "night": {
          background.style.backgroundImage = `url(${getPicture(
            currentCondition,
            nightOrDay,
            1
          )})`;
          break;
        }
      }
    }
    // ako vani pada snijeg, postavlja se slika za vrijeme sa snijegom
    else if (
      (data.current.condition.code >= 1204 &&
        data.current.condition.code <= 1237) ||
      (data.current.condition.code >= 1249 &&
        data.current.condition.code <= 1282)
    ) {
      let currentCondition = "snowy";
      switch (nightOrDay) {
        case "day": {
          background.style.backgroundImage = `url(${getPicure(
            currentCondition,
            nightOrDay,
            1
          )})`;
          break;
        }
        case "night": {
          background.style.backgroundImage = `url(${getPicure(
            currentCondition,
            nightOrDay,
            1
          )})`;
          break;
        }
      }
    }

    // ispisuje rezultate u DOM
    // glavni rezultati vremena
    resultDiv.innerHTML = `
<div id="results-container">
        <h1 class="temp">${currentTemp} &#176</h1>
        <div class="city-time">
        <h1 class="name">${cityName}</h1>
        <small>
          <span class="time">${splitTime(localTime)}</span>
          -
          <span class="date">${dayOfWeek()} :  ${
      removeFirstChar(splitDate(localTime)) < 10
        ? removeFirstChar(splitDate(localTime))
        : split(localTime)
    }</span>
        </small>
        </div>
        <div class="weather">
        <img src="${conditionImg}" alt="" width="50" height="50">
        <span class="condition">${conditionText}</span>
        </div>
</div>
    
    `;

    // dodatne informacije sa strane
    additionalInfo.innerHTML = `      <div class="more_information">
<ul class="info_items">
  <li><i class="fa-solid fa-droplet"></i> Currenty Humidity: ${currentHumidity}%</li>
  <li><i class="fa-solid fa-temperature-half"></i> Feels like: ${feelsLike} &#176</li>
  <li><i class="fa-solid fa-wind"></i> Wind: ${currentWind} km/h</li>
</ul>
</div>`;

    // opacity se postavlja na 1 zbog animacije
    background.style.opacity = "1";
  }
}

// ---------------------------------------------FUNKCIJE-----------------------------------------------------

// funkcija koja vraca trenutni datum
function currentDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[month]} ${day} `;
}

// funkcija koja vraća trenutno vrijeme
function currentTime() {
  const date = new Date();
  const hour = date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(); // ako je broj minuta manji od 10 dodaj 0 da se pokazu dvije decimale npr 14:00 umjetso 14:0
  return `${hour}:${minutes}`;
}

// funkcija koja vraća trenutni dan
function dayOfWeek() {
  const date = new Date();
  const day = date.getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

// funkcija koja vraća sliku za trenutno vrijeme
function getPicture(currentCondition, nightOrDay, number) {
  return (currentPicture =
    "./imgsrc/" + currentCondition + "-" + nightOrDay + number + "-min.jpg");
}

// get current hours
function splitTime(localTime) {
  const time = localTime.split(" ");
  const timeSplit = time[1].split(":");
  const hour = timeSplit[0];
  const minutes = timeSplit[1];
  return `${hour}:${minutes}`;
}

//get current day
function splitDate(localTime) {
  const time = localTime.split(" ");
  const date = time[0].split("-");
  const day = date[2];
  return `${day}`;
}

//remove first char of date -> 08 -> 7
function removeFirstChar(string) {
  return string.substring(1);
}
