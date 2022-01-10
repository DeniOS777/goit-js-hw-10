const FILTER_PARAMS = 'name,capital,population,flags,languages';

function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.com/v3.1/name/${searchQuery}?fields=${FILTER_PARAMS}`).then(
    response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      console.log(response);
      return response.json();
    },
  );
}

export { fetchCountries };
