const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/Router');
const cors = require('cors');
const connectDB = require('./db/Connection');
const { checkRappelEmail } = require('./services/RdvService');
connectDB()

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: '*', 
    optionsSuccessStatus: 200,
  }));
  

(async () => {
    while (true) {
      await checkRappelEmail();
    }
  })();

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

app.use('', routes);

app.listen(3000);
