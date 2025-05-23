require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const reservationRoutes = require('./routes/reservations');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reservations', reservationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started on port " + (process.env.PORT || 5000));
    });
  })
  .catch(err => console.log(err));
