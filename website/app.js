let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// OpenWeatherMap API
let baseUrl = `https://api.openweathermap.org/data/2.5/weather?zip=`;

// Personal API Key for OpenWeatherMap API
let apiKey = `&appid=94a60ba9902323d3a367fc8d8a1cd7dc&units=imperial`;

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e){
    const zipCode = document.getElementById('zip').value;
    const feelings = document.querySelector("#feelings").value;
    if(zipCode){
        getWeather(baseUrl, zipCode, apiKey)
        .then(function(data){
        console.log(data);
        postData("/addData", {
            name: data.name,
            date: newDate,
            temp: data.main.temp,
            weather: data.weather[0].description,
            content: feelings
            
         });updateUI()
    })
    }else if(!zipCode){
        alert('Enter your country Zipcode')
    }     
}

/* Function to GET Web API Data*/
const getWeather = async(baseUrl, code, key)=>{
    const res = await fetch(baseUrl+code+key)
    try{
        const data = await res.json();
        return data;
    }catch(error){
        console.log("error", error);
    }
}


/* Function to POST data */
const postData = async ( url = '', data = {})=>{
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
    try {
      const newData = await response.json();
      return newData
    }catch(error) {
    console.log("error", error);
    }
}

/* Function to GET Project Data */
const updateUI = async ()=> {
    const request = await fetch("/all");
    try {
        const allData = await request.json();
        console.log(allData);
        document.getElementById('townname').innerHTML = allData.name;
        document.getElementById('date').innerHTML = `Date: ${allData.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${allData.temp}`;
        document.getElementById('sky-status').innerHTML = `Sky state: ${allData.weather}`
        document.getElementById('content').innerHTML = `You must be feeling: ${allData.content}`;
    }catch(error){
        console.log("error", error)
    }
}

// Allow only numeric input
//ref: "https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input"
function onlyNumbers(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}