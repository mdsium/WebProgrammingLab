import DataFetcher from './dataFetch.js';

const fetcher = new DataFetcher('https://api.sunrisesunset.io/json?lat=23.81093&lng=90.36542', 'dataDisplay');
document.getElementById('fetchButton').addEventListener('click', () => fetcher.fetchData());
