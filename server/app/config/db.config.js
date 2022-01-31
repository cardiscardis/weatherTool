module.exports = {
    HOST: "localhost",// "ls-85e0c7953443c856054ab34b0224021a8e532c68.cccfog5vosxe.us-east-1.rds.amazonaws.com",
    USER: "root",//'dbmasteruser',
    PASSWORD: "",//"57passwordstrongridget",
    DB: "weathertooldb",//"weatherToolDB",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };