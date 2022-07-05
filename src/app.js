const button = document.getElementById("button"); //glavno dugme za pretraživanje
const input = document.getElementById("input"); //input polje za unos grada
const resultDiv = document.getElementById("results"); //div u koji se upisuju podaci
const background = document.querySelector(".weather-app"); //dohvati div kontenjer u kojem je cijela app
const additionalInfo = document.getElementById("additional_info"); //div kontenjer s desne strane app-a

button.addEventListener("click", checkWeather); //dodaje event listener na dugme
document.addEventListener("DOMContentLoaded", checkWeather); //kada se DOM učita, pozovi funkciju checkWeather

// funkcija koja dohvaca podatke o vremenu
async function checkWeather(e, city) {
  if (typeof e === "string" || e instanceof String) {
    city = e;
  } else {
    e.preventDefault();
  }

  // kad se funkcija pokrene, default prikazani grad je Rijeka
  city = input.value ? input.value : "Rijeka";
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
    pokaziToast();
    input.value = "";
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
    const localTime = data.location.localtime; // trenutno vrijeme lokacije koju pretražujemo

    // ako je vani sunčano, postavlja se slika za vrijeme sa suncem
    if (data.current.condition.code === 1000) {
      background.style.backgroundImage = `url(${getPicture(
        "sunny",
        nightOrDay,
        nightOrDay == "night" ? 1 : randomNumber
      )})`;
    }
    // ako je vani oblačno, postavlja se slika za vrijeme sa oblacima
    else if (izmedu(data.current.condition.code, 1003, 1030)) {
      background.style.backgroundImage = `url(${getPicture(
        "cloudy",
        nightOrDay
      )})`;
    }
    // ako je vani kiša, postavka sliku za vrijeme sa kišom
    else if (
      izmedu(data.current.condition.code, 1031, 1201) ||
      izmedu(data.current.condition.code, 1240, 1249)
    ) {
      background.style.backgroundImage = `url(${getPicture(
        "rainy",
        nightOrDay
      )})`;
    }
    // ako vani pada snijeg, postavlja se slika za vrijeme sa snijegom
    else if (
      izmedu(data.current.condition.code, 1204, 1237) ||
      izmedu(data.current.condition.code, 1249, 1282)
    ) {
      background.style.backgroundImage = `url(${getPicture(
        "snowy",
        nightOrDay
      )})`;
    }

    // ispisuje rezultate u DOM
    // glavni rezultati vremena
    resultDiv.innerHTML = `
<div id="results-container">
        <h1 class="temp">${currentTemp} &#176</h1>
        <div class="city-time">
        <h1 class="name">${cityName}</h1>
        <small>
          <span class="time">${trenutnoVrijemePretrazivanogGrada(
            localTime
          )}</span>
          -
          <span class="date">${trenutniDatumPretrazivanogGrada(
            localTime
          )}</span>
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
    createELement();
    loopThroughList();
    removeListItemIfTooLong();
    input.value = "";
  }
}

// ---------------------------------------------FUNKCIJE-----------------------------------------------------

// funkcija koja vraća sliku za trenutno vrijeme, prima parametre za vrijeme, dan/noć i broj slike
function getPicture(currentCondition, nightOrDay, number = 1) {
  return (currentPicture =
    "./imgsrc/" + currentCondition + "-" + nightOrDay + number + "-min.jpg");
}

// vraća trenutno vrijeme za lokaciju koju pretraživamo
function trenutnoVrijemePretrazivanogGrada(localTime) {
  const date = new Date(localTime);
  return `${date.getHours()}:${date.getMinutes()}`;
}

//vraća trenutni dan-tj. datum za lokaciju koju pretraživamo
function trenutniDatumPretrazivanogGrada(localTime) {
  const date = new Date(localTime);
  return `${date.toLocaleString("en-EN", {
    weekday: "long",
  })}, ${date.getDate()} ${date.toLocaleString("en-EN", {
    month: "short",
  })}`;
}

//Funckcija koja provjerava dali je vrijednost @x izmedu min i max
function izmedu(x, min, max) {
  return x >= min && x <= max;
}

function pokaziToast() {
  // Get the snackbar DIV
  const alertDiv = document.getElementById("snackbar");
  // Add the "show" class to DIV
  alertDiv.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    alertDiv.className = alertDiv.className.replace("show", "");
  }, 3000);
}

// kreira novi list item od zadnje pretrage
function createELement() {
  const ul = document.getElementById("list");
  const li = document.createElement("li");
  li.classList.add("list-item");
  if (input.value === "") {
  } else {
    li.appendChild(document.createTextNode(`${input.value}`));
    ul.appendChild(li);
  }
}

// ako je lista duza od 5, briše prvi list item
function removeListItemIfTooLong() {
  const ul = document.getElementById("list");
  const li = document.getElementsByClassName("list-item");
  if (li.length > 5) {
    ul.removeChild(li[0]);
  }
}

// loopa list iteme i postavlja event listener na svaki list item koji pokrece glavnu funkciju s novim inputom
function loopThroughList() {
  const ul = document.getElementById("list");
  const li = document.getElementsByClassName("list-item");

  for (const item of li) {
    item.addEventListener("click", function () {
      input.value = item.innerText;
      checkWeather(input.value);
    });
  }
}
