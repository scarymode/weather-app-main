const settingButton = document.querySelector("#setting");
const settingContent = document.querySelector(".setting_content");
const switchUnit = document.querySelector("#switch");

const tempButtons = document.querySelectorAll(".temp_button");
const speedButtons = document.querySelectorAll(".speed_button");
const precButtons = document.querySelectorAll(".prec_button");

settingButton.addEventListener("click", (e) => {
  e.stopPropagation(); 
  const currentDisplay = window.getComputedStyle(settingContent).display;
  settingContent.style.display = currentDisplay === "none" ? "flex" : "none";
});

document.addEventListener("click", (e) => {
  if (!settingContent.contains(e.target) && !settingButton.contains(e.target)) {
    settingContent.style.display = "none";
  } 
});

function makeToggleGroup(buttons, storageKey) {
  const savedValue = localStorage.getItem(storageKey);
  let activeButton = savedValue ? [...buttons].find(b => b.textContent.trim() === savedValue) : buttons[0];
  if (activeButton) activeButton.classList.add("active");

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem(storageKey, btn.textContent.trim());
    });
  });
}

makeToggleGroup(tempButtons, "temperatureUnit");
makeToggleGroup(speedButtons, "windSpeedUnit");
makeToggleGroup(precButtons, "precipitationUnit");

switchUnit.addEventListener("click", () => {
  const currentUnit = localStorage.getItem("temperatureUnit") || "Celsius (°C)";

  if (currentUnit.includes("°F")) {
    tempButtons.forEach(b => b.classList.remove("active"));
    speedButtons.forEach(b => b.classList.remove("active"));
    precButtons.forEach(b => b.classList.remove("active"));

    tempButtons[0].classList.add("active"); 
    speedButtons[0].classList.add("active");
    precButtons[0].classList.add("active"); 

    localStorage.setItem("temperatureUnit", "Celsius (°C)");
    localStorage.setItem("windSpeedUnit", "km/h");
    localStorage.setItem("precipitationUnit", "Millimeters (mm)");

    switchUnit.textContent = "Switch to Imperial";
  } else {
    tempButtons.forEach(b => b.classList.remove("active"));
    speedButtons.forEach(b => b.classList.remove("active"));
    precButtons.forEach(b => b.classList.remove("active"));

    tempButtons[1].classList.add("active"); 
    speedButtons[1].classList.add("active");
    precButtons[1].classList.add("active"); 

    localStorage.setItem("temperatureUnit", "Fahrenheit (°F)");
    localStorage.setItem("windSpeedUnit", "mph");
    localStorage.setItem("precipitationUnit", "Inches (in)");

    switchUnit.textContent = "Switch to Metric";
  }
});

const searchInput = document.querySelector("input");
const searchButton = document.querySelector(".search button");
const cityName = document.querySelector(".city_selected");
const countryName = document.querySelector(".country_selected");
const flagImg = document.querySelector(".flag");

let countryCodeMap = {};

fetch("./country_code.json")
  .then(response => response.json())
  .then(data => {
    countryCodeMap = data;
  })
  .catch(error => {
    console.error("Error loading country codes:", error);
  });

function getCountryCode(name) {
  if (!name) return null;

  if (countryCodeMap[name]) return countryCodeMap[name].toUpperCase();

  const lower = name.toLowerCase();
  for (const [key, code] of Object.entries(countryCodeMap)) {
    if (key.toLowerCase() === lower) return code.toUpperCase();
  }

  return null;
}

searchButton.addEventListener("click", () => {
  const content = searchInput.value.trim();
  if (!content) return;

  fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&q=" + encodeURIComponent(content))
    .then(response => response.json())
    .then(data => {
      if (!data || data.length === 0) {
        cityName.textContent = "City Not Found";
        countryName.textContent = "";
        if (flagImg) flagImg.src = "";
        return;
      }

      const place = data[0];

      let detectedCountry =
        place.address?.country ||
        place.display_name.split(",").pop().trim();

      const city = place.display_name.split(",")[0].trim() || "Unknown Location";
      cityName.textContent = `${city}, ${detectedCountry}`

      let countryCode = getCountryCode(detectedCountry);

      if (countryCode && flagImg) {
        flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
        flagImg.alt = `Flag of ${detectedCountry}`;
      } else if (flagImg) {
        flagImg.src = "";
      }
    })
    .catch(error => {
      console.error("Error fetching location data:", error);
      cityName.textContent = "Nothing found";
      countryName.textContent = "";
      if (flagImg) flagImg.src = "";
    });
});

let date = new Date().toDateString();
document.querySelector(".date").textContent = date;
