const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
 
const app = express();
const port = process.env.PORT || 8080;



var admin = require("firebase-admin"); // Use const for constant value

var serviceAccount = require("./calorie-calc-92ec4-firebase-adminsdk-gj2b1-e5b395db87.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


console.log('done');
 
