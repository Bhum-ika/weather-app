const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingscreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorContainer=document.querySelector(".not-found-section");
const errorImg=document.querySelector("[data-errorImg]");
const errorText=document.querySelector("[data-errorText]");
const errorButton=document.querySelector("[data-errorButton]")
//initial variable need?

let currentTab=userTab;
const API_KEY= "553a33fe7b2cf4aa05289cc02d7b1c02";
currentTab.classList.add("current-tab");  
getFromSessionStorage();

function switchTab(clickedTab){
    errorContainer.classList.remove("active"); 
    if(clickedTab!=currentTab){  
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage(); 

        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})
//check if cordinates are already present in session storage
function getFromSessionStorage(){
 const localCoordinates=sessionStorage.getItem("user-coordinates");
 if(!localCoordinates){
    grantAccessContainer.classList.add("active");
 }
 else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);

 }

}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
     //make loader visible
     loadingscreen.classList.add("active");
   

     //api call
     try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data=await response.json();
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        

        renderWeatherInfo(data);
     }catch(err){
      loadingscreen.classList.remove("active"); 
      errorContainer.classList.add("active");
      errorImg.style.display="none";
      errorText.innerText=`Error:${err?.message}`;
      errorButton.style.display="block";
      errorButton.addEventListener("click",fetchUserWeatherInfo);
     }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch elements
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const weatherDesc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]")
    const humidity=document.querySelector("[data-humidity]");
    const clouds=document.querySelector("[data-clouds]");

    //fetch values and put in elements
    cityName.innerText=weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    clouds.innerText=`${weatherInfo?.clouds?.all}%`;
} 
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
         //show an alert for no geolocation support avaialble
         window.alert("No geolocation available");
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value==="")return;
    else
    fetchSearchWeatherInfo(searchInput.value);
})

async function fetchSearchWeatherInfo(searchInfo){
 loadingscreen.classList.add("active");
 userInfoContainer.classList.remove("active");
 grantAccessContainer.classList.remove("active");
 errorContainer.classList.remove("active"); 

 try{
 const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInfo}&appid=${API_KEY}`);
 const data=await response.json();
 if(!data.sys){
    throw data;
 }
 loadingscreen.classList.remove("active");
 userInfoContainer.classList.add("active");

 renderWeatherInfo(data);
 }catch(err){
    loadingscreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    errorContainer.classList.add("active");
    errorText.innerText=`${err?.message}`;
    errorButton.style.display="none";
 }
}
