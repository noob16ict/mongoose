const express = require('express');
const {firstRouter} = require('./routes/firstRouter');
const rootDir = require('./util/pathUtils');
const errorController = require('./controllers/error');
const {mongoConnect} = require('./util/databaseUtil');
const { default: mongoose } = require('mongoose');

const app = express();
app.use(express.urlencoded());
app.use(firstRouter);


app.set('view engine', 'ejs');
app.set('views','views');

app.use(errorController.showErrorMsg);

const PORT  = 3002;

/* mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}) */

mongoose.connect("mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority&appName=abidICT")
.then(
 ()=>{
  console.log("Connected via mongoose: ");
   app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
 }
)
.catch( err=>{
  console.log("error occured!", err);
})