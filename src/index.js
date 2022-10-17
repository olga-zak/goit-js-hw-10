'use strict';
import './css/styles.css';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
//Задание - поиск стран
//Создай фронтенд часть приложения поиска данных о стране по её частичному или полному имени.
//HTTP-запросы
//Используй публичный API Rest Countries (https://restcountries.com/), а именно ресурс
//name(https://restcountries.com/#api-endpoints-v3-name), возвращающий массив объектов стран
//удовлетворивших критерий поиска.Добавь минимальное оформление элементов интерфейса.
//+ Напиши функцию fetchCountries(name) которая делает HTTP-запрос на ресурс name и возвращает промис с массивом стран - результатом запроса.
//+ Вынеси её в отдельный файл fetchCountries.js и сделай именованный экспорт.
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryDataWrapper = document.querySelector('.country-info');
const countriesList = document.querySelector('.country-list');
const inputRef = document.querySelector('#search-box');

//+ HTTP - запросы выполняются при наборе имени страны, то есть по событию input.
//+ Но, делать запрос при каждом нажатии клавиши нельзя, так как одновременно получится много запросов и они будут выполняться в непредсказуемом порядке.
//+ Необходимо применить приём Debounce на обработчике события и делать HTTP - запрос спустя 300мс после того, как пользователь перестал вводить текст. Используй пакет lodash.debounce.
inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(event) {
  //+ Если пользователь полностью очищает поле поиска, то HTTP - запрос не выполняется,
  //+ а разметка списка стран или информации о стране пропадает.
  countryDataWrapper.innerHTML = '';
  countriesList.innerHTML = '';
  if (event.target.value === '') {
    return;
  }
  //+ Выполни санитизацию введенной строки методом trim(), это решит проблему когда в поле ввода только пробелы или они есть в начале и в конце строки.
  fetchCountries(event.target.value.trim())
    .then(data => {
      // Интерфейс
      //+ Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным.
      //+ Для уведомлений используй библиотеку notiflix и выводи такую строку "Too many matches found. Please enter a more specific name.".
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      //+ Если результат запроса это массив с одной страной, в интерфейсе отображается разметка карточки с данными о стране: флаг, название, столица, население и языки.
      if (data.length === 1) {
        renderCountryData(data);
        stylizeCountryData();
      }
      //+ Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран. Каждый элемент списка состоит из флага и имени страны.
      else {
        renderCountriesList(data);
        stylizeCountriesList();
      }
    })
    //+ Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не пустой массив, а ошибку со статус кодом 404 - не найдено. Если это не обработать, то пользователь никогда не узнает о том, что поиск не дал результатов. Добавь уведомление "Oops, there is no country with that name" в случае ошибки используя библиотеку notiflix.
    .catch(error =>
      Notiflix.Notify.failure('"Oops, there is no country with that name"')
    );
}
//ВНИМАНИЕ
//-??? Не забывай о том, что fetch не считает 404 ошибкой, поэтому необходимо явно отклонить промис чтобы можно было словить и обработать ошибку.

function renderCountryData(arr) {
  const markup = arr
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class='country-info__header'><img src='${
        flags.svg
      }' alt='flag of ${name.official}' width=30><p>${
        name.official
      }</p></div><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population}</p><p><b>Languages:</b> ${Object.values(
        languages
      ).join(', ')}</p>
      `;
    })
    .join('');
  countryDataWrapper.innerHTML = markup;
}
function stylizeCountryData() {
  const header = document.querySelector('.country-info__header');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.lastElementChild.style.marginLeft = '10px';
  header.lastElementChild.style.marginTop = '0';
  header.lastElementChild.style.marginBottom = '0';
  header.lastElementChild.style.fontSize = '35px';
  header.lastElementChild.style.fontWeight = 'bold';
}

function renderCountriesList(arr) {
  const markupList = arr
    .map(country => {
      return `<li><img src='${country.flags.svg}' alt='flag of ${country.name.official}' width=30><p>${country.name.official}</p></li>`;
    })
    .join('');
  countriesList.innerHTML = markupList;
}
function stylizeCountriesList() {
  countriesList.style.listStyle = 'none';
  countriesList.style.margin = '0';
  countriesList.style.padding = '0';

  //console.log(countriesList.children); // HTMLCollection(4) [li, li, li, li] почему forEach не работает с этим массивом?
  //countriesList.children.forEach(child => console.log(child)); //срабатывает catch
  const countriesListItems = document.querySelectorAll('li'); // NodeList(4) [li, li, li, li]
  countriesListItems.forEach(item => {
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.lastElementChild.style.marginLeft = '10px';
    item.lastElementChild.style.marginTop = '0';
    item.lastElementChild.style.marginBottom = '0';
    item.lastElementChild.style.fontSize = '20px';
    item.lastElementChild.style.fontWeight = 'medium';
  });
}
