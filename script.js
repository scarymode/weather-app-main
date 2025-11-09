const settingButton = document.querySelector("#setting")
const settingContent = document.querySelector(".setting_content")

settingButton.addEventListener("click", () => {
    if (settingContent.style.display === "none") {
        settingContent.style.display = 'flex'
    }
    else {
        settingContent.style.display = 'none'
    }
})
function makeToggleGroup(selector, storageKey) {
    const buttons = document.querySelectorAll(selector)

    const savedValue = localStorage.getItem(storageKey);
    let activeButton = savedValue ? [...buttons].find(b => b.textContent.trim() === savedValue) : buttons[0];
    activeButton.classList.add("active")

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
            localStorage.setItem(storageKey, btn.textContent.trim());
        })
    })    
}

makeToggleGroup(".temp_button",  "temperatureUnit");
makeToggleGroup(".speed_button", "windSpeedUnit");
makeToggleGroup(".prec_button",  "precipitationUnit");

document.addEventListener('click', (e) => {
    const isClickedInside = settingContent.contains(e.target) || settingButton.contains(e.target)
    if (!isClickedInside) {
        settingContent.style.display = 'none'
    }
})