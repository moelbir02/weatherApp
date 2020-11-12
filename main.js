const api = {
    key: "2e2b01a70f3a169cf990891daa98908a",
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
const inputErrPara = document.getElementById('input-err');
searchbox.addEventListener('keypress', setQuery);


function setQuery(evt) {
    let valid = false;
   
    if (evt.keyCode == 13) {
        getResults(searchbox.value);
    }
    if (searchbox.value) {
        const pattern = /^[a-z A-Z]+$/;
        var currentValue = evt.target.value;
        valid = pattern.test(currentValue);
        if (valid) {
            inputErrPara.style.display = 'none'
            getResults();
        } else {    
            inputErrPara.style.display = 'block'
        }
    }

}



function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults);
}

function displayResults (weather){
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C `;
}

function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
    
}