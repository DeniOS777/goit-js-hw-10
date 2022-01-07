import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
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
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries()
    .then(countrys => {
      if (countrys.length > 10) {
        return Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countrys.length >= 2 && countrys.length <= 10) {
        console.log(countrys);
        refs.countryInfo.innerHTML = '';
        renderCountrys(countrys);
      } else {
        refs.countryList.innerHTML = '';
        renderCountry(countrys);
      }
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

function renderCountrys(countrys) {
  const markup = countrys
    .map(({ flags, name }) => {
      return `<li class="country-item">
        <img src="${flags.svg}" width="40" alt="Country flag" />
        <p class="country-name">${name.common}</p>
      </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountry(countrys) {
  const markup = countrys
    .map(({ flags, name, population, languages, capital }) => {
      return `<ul class="country-list">
        <li class="country-item">
          <img src="${flags.svg}" width="40" alt="Country flag" />
          <p class="country-name">${name.common}</p>
        </li>
      </ul>
      <p><span class="country-info__text">Capital:</span> ${capital}</p>
      <p><span class="country-info__text">Population:</span> ${population}</p>
      <p><span class="country-info__text">Language:</span> German, ${languages}</p>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}
