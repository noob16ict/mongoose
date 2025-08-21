const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


//const rootDir = require('./util/pathUtils');

const {firstRouter} = require('./routes/firstRouter');
const errorController = require('./controllers/error');
//const {mongoConnect} = require('./util/databaseUtil');
const { default: mongoose } = require('mongoose');


const app = express();

const store = new MongoDBStore ({
  uri:"mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority&appName=abidICT",
  collection:'session'
})
app.use(express.urlencoded());

app.use(session({
secret: 'this-is-secret',
resave: false,
saveUninitialized: true,
store
})
)

app.use((req,res,next)=>{
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})

app.use("/form", (req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }
  else{
    res.redirect('/login');
  }
});
app.use("/result", (req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }
  else{
    res.redirect('/login');
  }
});
app.use("/delete", (req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }
  else{
    res.redirect('/login');
  }
});
app.use("/edit", (req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }
  else{
    res.redirect('/login');
  }
});
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
