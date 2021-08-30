const express = require("express");
const {readdirSync} = require('fs');
const cors = require('cors')
const mongoose = require('mongoose');
const morgan = require('morgan');

require('dotenv').config();

const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(()=> console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// route middleware
readdirSync('./routes').map((r) =>
  app.use('/api', require(`./routes/${r}`))
)

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server us runnning on port ${port}`));