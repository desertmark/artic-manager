# Artic/Manager
An Articles Manager REST API Base on NodeJS

## Run the project.

To run the project you will need to install the following softwares:
1. MongoDB
2. NodeJS

To run the project:
1. Restore Packages with  `npm i`
2. Run the database with `npm run localdb`
    * This commands relies on the ``MONGO_DB_PATH`` enviroment variable. You'll need to set it up on your computer before running this command. this is the `data` directory configured for the mongoDB instance.
3. Run the app with `npm start`
    * you should see the app running on ``http://localhost:3000/info``