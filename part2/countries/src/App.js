import { useEffect, useState } from "react";
import { Country } from "./Components/Country";

const App = () => {
  const [showCountry, setShowCountry] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => response.json())
      .then((initialCountries) => setCountries(initialCountries));
  }, []);

  function handleFilter(event) {
    setFilter(event.target.value);
  }
  
  return (
    <div>
      find countries <input value={filter} onChange={handleFilter}></input>
      <div>
        <Country
          countries={countries}
          filter={filter}
          showCountry={showCountry}
          setShowCountry={setShowCountry}
        />
      </div>
    </div>
  );
};

export default App;
