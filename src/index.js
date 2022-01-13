import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './fetchCountries';
import renderCountriesTpl from '../src/templates/renderCountriesTpl';
import renderCountryTpl from '../src/templates/renderCountryTpl';

import './css/styles.css';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onInputEnterValue, DEBOUNCE_DELAY));

function onInputEnterValue(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    return cleaningRenderCountrys();
  }

  fetchCountries(searchQuery)
    .then(countrys => {
      if (countrys.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return cleaningRenderCountrys();
      }

      if (countrys.length >= 2 && countrys.length <= 10) {
        refs.countryInfo.innerHTML = '';
        Notify.success('You found some countrys');
        cleaningRenderCountrys();
        return renderCountrys(countrys);
      } else {
        refs.countryList.innerHTML = '';
        Notify.success('You found one country, see detailed information');
        cleaningRenderCountrys();
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
  const markup = renderCountryTpl(countrys);
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function errorHandler() {
  Notify.failure('Oops, there is no country with that name.');
}

function cleaningRenderCountrys() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
