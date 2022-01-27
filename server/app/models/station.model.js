module.exports = (sequelize, Sequelize) => {
    const Station = sequelize.define("station", {
      station: {
        type: Sequelize.STRING
      },
      sub_station: {
        type: Sequelize.STRING
      },      
      Latitude: {
        type: Sequelize.STRING
      },
      Longitude: {
        type: Sequelize.STRING
      },      
      District: {
        type: Sequelize.STRING
      },
      StationHeight: {
        type: Sequelize.STRING
      },
      Status: {
        type: Sequelize.STRING
      },
      YearOpened: {
        type: Sequelize.STRING
      },
      GPSCoordinates: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      }
    }, {
        tableName: 'station',
        timestamps: false
    });

    Station.removeAttribute('id');
    return Station;
  };