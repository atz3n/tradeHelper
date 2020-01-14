# tradeHelper
an experimental trading platform


## Precondition
* [Meteorjs](https://www.meteor.com) installed
* [npm](https://www.npmjs.com) installed


## Configuration
see **settings-development.json** or  **settings-production.json** in settings folder

## Starting
* Development mode: `npm run startDev`
* Production mode: `npm run startProd`
* Multithreaded development mode: `npm run startDevMltCore`
* Multithreaded production mode: `npm run startProdMltCore`

## Change User to Admin
When you start the application and register, your user account will have the role "user" by default and you will not be able to see the admin panel. To make yourself admin, you first need to find your user ID. Open mongo shell on the server and type: `db.users.find().pretty()`. Copy your user id and then type: `db.users.update({ _id: "YOUR_USER_ID" }, { $set: { roles: ["admin"] } })`. Now, you have an admin panel in your application and you can manage users.


## Liability
This project is published under the AGPL and comes without any liability or warranty.
This also applies explicitly to financial losses.

The project was created for learning purposes and has no claim to legal certainty and completeness.
