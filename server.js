const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

//MONGOOSE
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('----------------------------------');
    console.log('DB connection successfull 🔥!');
  });

// SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port:${port}`);
  console.log('----------------------------------');
});
