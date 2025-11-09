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
