// API مجاني لا يحتاج إلى تسجيل أو مفاتيح
const apiKey = ""; 
const apiUrl = "https://api.open-meteo.com/v1/forecast";

const cityInput = document.getElementById("cityInput");
const cityNameEl = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");

async function getWeather() {
    const city = cityInput.value.trim() || "Amman"; // إذا ما كتبت شي، بيجيب طقس عمان

    try {
        // الخطوة 1: جلب إحداثيات المدينة (خط الطول والعرض)
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            alert("City not found! Please try again.");
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        
        // تحديث اسم المدينة
        cityNameEl.textContent = `${name}, ${country}`;

        // الخطوة 2: جلب بيانات الطقس بناءً على الإحداثيات
        const weatherResponse = await fetch(`${apiUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
        const weatherData = await weatherResponse.json();

        // الخطوة 3: عرض البيانات
        const current = weatherData.current;
        temperatureEl.textContent = `${current.temperature_2m}°C`;
        humidityEl.textContent = `Humidity: ${current.relative_humidity_2m}%`;
        
        // تحويل رقم حالة الطقس إلى وصف مفهوم
        descriptionEl.textContent = getWeatherDescription(current.weather_code);
changeBackground(current.weather_code);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Something went wrong. Please check your internet connection.");
    }
}

// دالة مساعدة لترجمة أكواد الطقس إلى كلمات
function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
        55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 95: "Thunderstorm"
    };
    return weatherCodes[code] || "Unknown weather";
}
function changeBackground(code) {
    // إزالة أي كلاس قديم
    document.body.className = ''; 

    if (code === 0 || code === 1) {
        document.body.classList.add('bg-clear');
    } else if (code === 2 || code === 3) {
        document.body.classList.add('bg-clouds');
    } else if (code >= 51 && code <= 65) {
        document.body.classList.add('bg-rain');
    } else if (code >= 71 && code <= 75) {
        document.body.classList.add('bg-snow');
    } else if (code >= 95) {
        document.body.classList.add('bg-thunder');
    } else {
        document.body.classList.add('bg-default');
    }
}
// تشغيل البحث عند الضغط على زر Enter
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

// تشغيل التطبيق أول مرة بمدينة عمان
getWeather();