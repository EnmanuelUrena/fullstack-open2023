import { useEffect, useState } from "react";
import { Weather } from "./Weather";

export const Content = ({ country }) => {
  const [weather, setWeather] = useState({});
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${country[0].capitalInfo.latlng[0]}&lon=${country[0].capitalInfo.latlng[1]}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch(error => console.error(error))
  }, [URL]);

  return (
    <div>
      <h1>{country[0].name.common}</h1>
      <p>capital {country[0].capital?.[0]}</p>
      <p>area {country[0].area}</p>

      <p>
        <b>languages:</b>
      </p>
      <ul>
        {Object.values(country[0].languages).map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <img src={country[0].flags["png"]} alt={country[0].flags["alt"]} />
      {Object.keys(weather).length > 0 ? <Weather country={country} weather={weather}/> : <div></div>}
    </div>
  );
};
