const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

//inicializaciones
const app = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');


//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

module.exports = app;