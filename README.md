# Tiyas Catalog Ways

This project was created for the test from Astra.

## How To Run This Project


### `npm run local-build`

This command will create the database needed for the Aplication, install depencencies, and make sure you can use this app.\
Make sure you run your Database such as MySQL.

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\


## How To Customly Run This Project

In the project directory, you should run:

### `npm run create`

This command will create the database needed for the Aplication.\
Make sure you run your Database such as MySQL.

You can configure the database name, username and password at `config` folder.

### `npm run migrate`

This command will create the tables for the Application.\
Make sure you run `npm run create` before.

### `npm run seed`

This command will create the user to use as the default usename and password for the Application.\
`tiyas.akbar@gmail.com` is the admin email.\
`tiyasakbar` is the password for the admin.

You can configure the default user and the role from at `seeders`folder.

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\