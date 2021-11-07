Edited readme
-------------

Installing node dependencies
----------------------------
All files except the node modules have been pushed. This means that all node dependencies must be installed before starting the app.
To install all required node dependencies, from datable root folder run:
npm install

The same dependencies are used by the React app.

running sql server
------------------
However, before running the app, You must serve sql whether locally using e.g. xampp, or remotely, using the aws-hosted sql database.
The same data contained in the aws-hosted sql database was used for the entire project.

Authentication and request servers
----------------------------------
After running the sql server, you will need to run both node server and fastapi server 
(You could create multiple terminals in VS Code for easily running each servers in one place). 
I used node.js to handle all authentication requests which stores user information in the sql database, but Fastapi handles all user requests.

Running node (Authentication) server
------------------------------------
However to run node.js server, sql credentials must be supplied to the node app.
Using your editor, navigate to:
server/config/db.config.js (to change sql credentials)

You may want to change your secret key to something more secure for production. Navigate to:
server/config/auth.config.js (to change your secret key).

then run from cli:
cd server (to change to node directory)
node server (to start the node server)

Running FastApi (User Request) server
--------------------------------
To run FastApi server, first, you need to input the sql credentials required.
Using your editor, navigate to:
server/fastapi/.env (and replace the credentials as required).

Then run the following commands from cli:

cd server/fastapi (to change diretory to fastapi directory)

pip install --user pipenv (to install pipenv. pipenv would install fastapi dependencies environmentally, unlike pip or pip3. 
However, you need python and pip for this).

pipenv shell (To initialize a virtual environment for the project).

pipenv install (to install all fastapi dependencies present in the pipfile)

finally, run 
unicorn main:app --reload (to start the fastapi server).

Running React app
-----------------

run:
npm start (to start the app).

Warning
-------
The same data in the aws-hosted sql database was used to create this app. If you need to replicate these data on your local machine,
run the previous python app that scrapes the data to your local sql server. Remember to connect the scraper to your sql server by providing
the required credentials in the scraper.

Thanks.

Warm Regards, 

Ibukun Olofin.
giftedcardis@outlook.com



After installation, also from the datable root folder, run:
npm start
to start the app



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
