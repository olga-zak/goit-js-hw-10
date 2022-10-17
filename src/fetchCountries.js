//Фильтрация полей
//В ответе от бэкенда возвращаются объекты, большая часть свойств которых тебе не пригодится.
//Чтобы сократить объем передаваемых данных добавь строку параметров запроса - так этот бэкенд реализует фильтрацию полей.
//Ознакомься с документацией синтаксиса фильтров. https://restcountries.com/#filter-response

// Тебе нужны только следующие свойства:
// name.official - полное имя страны
// capital - столица
// population - население
// flags.svg - ссылка на изображение флага
// languages - массив языков
const BASE_URL = 'https://restcountries.com/v3.1/name/';
const params = 'name,capital,population,flags,languages';
//при рендере разметки используй name.official и flags.svg

export function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}?fields=${params}`).then(response => {
    if (!response.ok) {
      //console.log('error mfk');
      throw new Error(response.status);
    }
    return response.json(); //Promise
  });
}
