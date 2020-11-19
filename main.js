const api = {
    key: "2e2b01a70f3a169cf990891daa98908a",
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
let errorArray = ['Invalid input', 
                  'No result found', 
                  'Please submit a value',
                  'Something went wrong, try again later',
                  'You are unauthorized' ];

searchbox.addEventListener('keydown', setQuery);

function setQuery(evt) {
    const pattern = /^[a-z A-Z]+$/;
    let currentValue = evt.target.value;
    let valid = pattern.test(currentValue);

    if(!currentValue && evt.keyCode == 13 ){
        displayBlockById('input-err');
        insertInnerHTML('input-err', errorArray[2] )
    }
    if(!currentValue && evt.keyCode !== 13){
        displayNoneById('input-err')
        displayNoneById('updated-location');
        displayNoneById('updated-current');
        displayBlockById('location');
        displayBlockById('current');
    }
    if(!valid && currentValue){
        displayBlockById('input-err');
        insertInnerHTML('input-err', errorArray[0])
    }
    if (valid && currentValue && evt.keyCode == 13) {
        getResults(searchbox.value);
    }
}

function getResults(query) {
    try{
        fetch(`${api.base}weather?q=${query.trim()}&units=metric&APPID=${api.key}`)
            .then(weather => weather.json())
            .then(displayResults)
            .catch(err)
    } catch(err){}
}

function displayResults (weather){
    if(weather.cod === 200){
        displayNoneById('input-err');
        displayNoneById('location');
        displayNoneById('current');
        displayBlockById('updated-location');
        displayBlockById('updated-current');

        let now = new Date();
        insertInnerText('.updated-location .city', `${weather.name}, ${weather.sys.country}` )
        insertInnerText('.updated-location .date', dateBuilder(now));
        insertInnerText('.updated-current .temp', `${Math.round(weather.main.temp)}°C`);
        insertInnerText('.updated-current .weather', weather.weather[0].main )
        insertInnerText('.updated-current .hi-low', `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C `)
    } else if(weather.cod === "404"){
        displayNoneById('updated-location');
        displayNoneById('updated-current');
        displayBlockById('input-err');
        insertInnerHTML('input-err', errorArray[1] )
    } else if(weather.cod === 401){
        displayNoneById('updated-location');
        displayNoneById('updated-current');
        displayBlockById('input-err');
        insertInnerHTML('input-err', errorArray[4] )
    }
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

function displayNoneById(id){
    document.getElementById(id).style.display= 'none';
}

function displayBlockById(id){
    document.getElementById(id).style.display= 'block';
}

function insertInnerHTML(id, text){
    document.getElementById(id).innerHTML= text;
}

function insertInnerText(classtag, text){
    document.querySelector(classtag).innerText= text;
}