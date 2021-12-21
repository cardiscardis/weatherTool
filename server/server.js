const express = require("express");
const cors = require("cors");
//const path = require('path');

const app = express();

const db = require("./app/models");
//const Role = db.role;

/*
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
*/

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Have Node serve the files for our built React app
//app.use(express.static(path.resolve(__dirname, '../build')));

// test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to test application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// All other GET requests not handled before will return our React app
/*app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});
*/
// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/*
function initial() {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
  }
  */
/*  
  If you don't use initial() function in Sequelize sync() method. You need to run following SQL script:

mysql> INSERT INTO roles VALUES (1, 'user', now(), now());
mysql> INSERT INTO roles VALUES (2, 'moderator', now(), now());
mysql> INSERT INTO roles VALUES (3, 'admin', now(), now());
3 records will be created in roles table:
*/