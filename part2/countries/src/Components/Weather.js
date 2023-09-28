export const Weather = ({ country, weather }) => {
  return (
    <div>
      <h1>Weather in {country[0].name.common}</h1>
      <p>temperature {weather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  );
};