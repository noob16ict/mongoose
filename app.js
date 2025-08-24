const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { check, validationResult } = require('express-validator');

//const rootDir = require('./util/pathUtils');

const {firstRouter} = require('./routes/firstRouter');
const errorController = require('./controllers/error');
//const {mongoConnect} = require('./util/databaseUtil');
const { default: mongoose } = require('mongoose');
const multer = require('multer');


const app = express();

const store = new MongoDBStore ({
  uri:"mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority&appName=abidICT",
  collection:'session'
})
const fileFilter = (req,file,cb)=>{
  if( [ 'image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype))
  {
    cb(null, true);
  }
  else cb(null,false);
}
function random(len){
  const sm = "abcdefghijklmnopqrstuvwxyz";
  const cap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  for(let i=0; i<len; i++)
  {
   res+= sm[Math.floor(Math.random() * sm.length)];
   res+= cap[Math.floor(Math.random() * cap.length)]; 
  }
  return res;
}

const storage = multer.diskStorage(
  {
    destination: (req,file,cb)=>{
      cb(null, 'uploads/');
    },
    filename: (req,file,cb)=>{
      cb(null, random(10)+'-'+file.originalname.replace(/\s+/g, ''));
    }
  }
);

app.use(express.urlencoded());
app.use(multer({storage, fileFilter}).single('photo'));
app.use('/uploads', express.static('uploads'));

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
