import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputEnterValue, DEBOUNCE_DELAY));

let querySearch = '';
const FILTER_PARAMS = 'fields=name,capital,population,flags,languages';

function onInputEnterValue(e) {
  querySearch = e.target.value.trim();
  if (querySearch === '') {
    return;
  }
  fetchCountries()
    .then(countrys => {
      if (countrys.length > 10) {
        return console.log('Too many matches found. Please enter a more specific name.');
      }
      console.log(countrys);
      renderFindCountrys(countrys);
    })
    .catch(error => {
      console.log(error);
    });
}

function fetchCountries() {
  return fetch(`https://restcountries.com/v3.1/name/${querySearch}?${FILTER_PARAMS}`).then(
    response => {
      return response.json();
    },
  );
}

function renderFindCountrys(countrys) {
  const markup = countrys
    .map(({ flags, name }) => {
      return `<li class="country-item">
        <img src="${flags.svg}" width="30" alt="Country flag" />
        <p class="country-name">${name.common}</p>
      </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}
