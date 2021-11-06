
const API_URL = 'http://localhost:8000/';

class FastService {
  async getWeatherContent(weatherType, stationCode) {
    let data = await fetch(API_URL + `${weatherType}/${stationCode}`);
    data = await data.json();
    return data;
  }

  async getStationCodes() {
    let stationCodes = await fetch(API_URL + 'station');
    stationCodes = await stationCodes.json();
    return stationCodes;
  }  
}

export default new FastService();