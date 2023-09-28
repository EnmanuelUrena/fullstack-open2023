import { Content } from "./Content";

export const Country = ({ countries, filter, setShowCountry, showCountry }) => {

  const oneCountry = countries.filter(
    (country) => country.name.common.toLowerCase() === filter.toLowerCase()
  );
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  function handleClick(country) {
    setShowCountry(showCountry.concat(country));
  }

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (filteredCountries.length === 1) {
    return <Content country={filteredCountries} />;
  }

  if (oneCountry.length === 1) {
    return <Content country={oneCountry} />;
  }

  return (
    <div>
      {filteredCountries.map((country) => {
        if (showCountry.includes(country)) {
          return <Content key={country.name.common} country={[country]} />;
        } else {
          return (
            <div key={country.name.common}>
              {country.name.common}{" "}
              <button onClick={() => handleClick(country)}>show</button>
            </div>
          );
        }
      })}
    </div>
  );
};
