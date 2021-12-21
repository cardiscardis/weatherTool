module.exports = (sequelize, Sequelize) => {
    const Station = sequelize.define("station", {
      station: {
        type: Sequelize.STRING
      },
      sub_station: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      }
    }, {
        tableName: 'station',
        timestamps: false
    });
  
    return Station;
  };