const db = require("../models");
const Station = db.station;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
  
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

  
exports.getCodes = (req, res) => {
  Station.findAll().then(codes => {      
    if (!codes) {
      return res.status(404).send({ message: "Codes Not found." });
    }    
    res.status(200).send(codes);          
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}


exports.getData = async (req, res) => {        

  WeatherModel = '';
  if (req.params.weatherType === 'Rainfall') {
    WeatherModel = await getWeatherModel(req, res, 'rain');
  } else if (req.params.weatherType === 'Minimum Temperature') {
    WeatherModel = await getWeatherModel(req, res, 'min_temp');
  } else if (req.params.weatherType === 'Maximum Temperature') {
    WeatherModel = await getWeatherModel(req, res, 'max_temp');
  } else if (req.params.weatherType === 'Solar Exposure') {
    WeatherModel = await getWeatherModel(req, res,'solar');
  }          
        

  WeatherModel.findAll().then(data => {
    if (!data) {
      return res.status(404).send({ message: "Data Not found." });
    }    
    res.status(200).send(data);          
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}



  const getWeatherModel = async (req, res, tablePrefix) => {
    let WeatherModel = '';
    if (tablePrefix === 'rain') {
      WeatherModel = await db.sequelize.define("WeatherModel", {
        product_code: {
          type: db.Sequelize.STRING
        },
        station_number: {
          type: db.Sequelize.STRING
        },
        year: {
          type: db.Sequelize.STRING
        },
        month: {
          type: db.Sequelize.STRING
        },
        day: {
          type: db.Sequelize.STRING
        },
        rainfall_amount: {
          type: db.Sequelize.STRING
        },
        measure_in_days: {
          type: db.Sequelize.STRING
        },
        quality: {
          type: db.Sequelize.STRING
        }
      }, {
          tableName: `${tablePrefix}${req.params.stationCode}`,
          timestamps: false
      });              
    }

    if (tablePrefix === 'min_temp') {
      WeatherModel = await db.sequelize.define("WeatherModel", {
        product_code: {
          type: db.Sequelize.STRING
        },
        station_number: {
          type: db.Sequelize.STRING
        },
        year: {
          type: db.Sequelize.STRING
        },
        month: {
          type: db.Sequelize.STRING
        },
        day: {
          type: db.Sequelize.STRING
        },
        min_temp_celsius: {
          type: db.Sequelize.STRING
        },
        days_of_accumulation: {
          type: db.Sequelize.STRING
        },
        quality: {
          type: db.Sequelize.STRING
        }
      }, {
          tableName: `${tablePrefix}${req.params.stationCode}`,
          timestamps: false
      });            
    }


    if (tablePrefix === 'max_temp') {
      WeatherModel = await db.sequelize.define("WeatherModel", {
        product_code: {
          type: db.Sequelize.STRING
        },
        station_number: {
          type: db.Sequelize.STRING
        },
        year: {
          type: db.Sequelize.STRING
        },
        month: {
          type: db.Sequelize.STRING
        },
        day: {
          type: db.Sequelize.STRING
        },
        max_temp_celsius: {
          type: db.Sequelize.STRING
        },
        days_of_accumulation: {
          type: db.Sequelize.STRING
        },
        quality: {
          type: db.Sequelize.STRING
        }
      }, {
          tableName: `${tablePrefix}${req.params.stationCode}`,
          timestamps: false
      });            
    }


    if (tablePrefix === 'solar') {
      WeatherModel = await db.sequelize.define("WeatherModel", {
        product_code: {
          type: db.Sequelize.STRING
        },
        station_number: {
          type: db.Sequelize.STRING
        },
        year: {
          type: db.Sequelize.STRING
        },
        month: {
          type: db.Sequelize.STRING
        },
        day: {
          type: db.Sequelize.STRING
        },
        solar_exposure: {
          type: db.Sequelize.STRING
        }
      }, {
          tableName: `${tablePrefix}${req.params.stationCode}`,
          timestamps: false
      });            
    }

      await WeatherModel.removeAttribute('id');
      return WeatherModel;
  }
