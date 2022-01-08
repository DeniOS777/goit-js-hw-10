import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './fetchCountries';
import renderCountriesTpl from '../src/templates/renderCountriesTpl';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputEnterValue, DEBOUNCE_DELAY));

function onInputEnterValue(e) {
  const searchQuery = e.target.value.trim();
  if (searchQuery === '') {
    return cleaningRenderCountrys();
  }
  fetchCountries(searchQuery)
    .then(countrys => {
      if (countrys.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return cleaningRenderCountrys();
      }
      if (countrys.length >= 2 && countrys.length <= 10) {
        console.log(countrys);
        refs.countryInfo.innerHTML = '';
        Notify.success('You found some countrys');
        return renderCountrys(countrys);
      } else {
        console.log(countrys);
        refs.countryList.innerHTML = '';
        Notify.success('You found one country, see detailed information');
        return renderCountry(countrys);
      }
    })
    .catch(error => {
      console.log(error);
      errorHandler();
      cleaningRenderCountrys();
    });
}

function renderCountrys(countrys) {
  const markup = renderCountriesTpl(countrys);
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountry(countrys) {
  const markup = countrys
    .map(({ flags, name, population, languages, capital }) => {
      return `<ul class="country-info-list">
        <li class="country-item">
          <img src="${flags.svg}" width="40" alt="Country flag" />
          <p class="country-name country-name-big">${name.common}</p>
        </li>
      </ul>
      <p class="country-info"><span class="country-info__text">Capital:</span> ${capital}</p>
      <p class="country-info"><span class="country-info__text">Population:</span> ${population}</p>
      <p class="country-info"><span class="country-info__text">Language:</span> ${Object.values(
        languages,
      )}</p>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function errorHandler() {
  Notify.failure('Oops, there is no country with that name.');
}

function cleaningRenderCountrys() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
