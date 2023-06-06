const timeel = document.getElementById("time");
const dateel = document.getElementById("date");
const currweatheritemel = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryel = document.getElementById("country");
const weatherforcastel = document.getElementById("weather-forecast");
const currtempe1 =document.getElementById("current-temp");

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const apikey = '0e74d6f055199e169d4d42a212cb8a76';
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time. getDay();
    const hour = time.getHours();
    const hoursin12hrf = hour>= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';

    timeel.innerHTML = (hoursin12hrf<10 ? '0'+hoursin12hrf : hoursin12hrf) + ':' + (minutes<10 ?'0'+minutes : minutes) + ' ' +
    `<span id="am-pm">${ampm}</span>`

    dateel.innerHTML = days[day] + ', ' + date + ' '+ months[month]
},1000);

function getweatherdate (){
    navigator.geolocation.getCurrentPosition((success) =>{
        let{latitude, longitude}= success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${apikey}`).then(res => res.json()).then(data =>{
            console.log(data)
            showWeatherData(data);
        })
    })
}
function showWeatherData(data){
    let{humidity, pressure, sunrise, sunset, windspeed}=data.current;
    
    timezone.innerHTML = data.timezone;
    countryel.innerHTML = data.lat + 'N'+ data.lon + 'E'
    
    currweatheritemel.innerHTML = 
    `<div class="weather-items">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-items">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-items">
        <div>Wind Speed</div>
        <div>${windspeed}</div>
    </div>
    <div class="weather-items">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-items">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, ind)=>{
        if(ind==0){
            currtempe1.innerHTML=`
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div>
                <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                <div class="temp"> day ${day.temp.day}&#176;C</div>
                <div class="temp"> night ${day.temp.night}&#175;C</div>
            </div>  `
        }
        else{
            otherDayForcast+=`
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp"> day ${day.temp.day}&#176;C</div>
                <div class="temp"> night ${day.temp.night}&#175;C</div>
            </div>`
        }
    })

    weatherforcastel.innerHTML = otherDayForcast;
}