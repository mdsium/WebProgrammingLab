import DataFetcher from './dataFetch.js';

const fetcher = new DataFetcher('https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873', 'dataDisplay');
document.getElementById('fetchButton').addEventListener('click', () => fetcher.fetchData());
