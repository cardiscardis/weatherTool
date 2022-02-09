module.exports = {
    HOST: "ls-85e0c7953443c856054ab34b0224021a8e532c68.cccfog5vosxe.us-east-1.rds.amazonaws.com",//localhost",// 
    USER: 'dbmasteruser',//"root",//
    PASSWORD: "57passwordstrongridget",//"",//
    DB: "weatherToolDB",//"weathertooldb",//
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };