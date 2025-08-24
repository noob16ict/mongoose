const session = require('express-session');
const fs = require('fs');

const model = require("../model/onlyModel");
const registeredUser = require('../model/registeredUser');

const { getDB } = require("../util/databaseUtil");
const { ObjectId } = require("mongodb");
//const { validationResult } = require('express-validator');

const { check, validationResult } = require('express-validator');
//const registeredUser = require('../model/registeredUser');

const bcrypt = require('bcryptjs');


exports.showSignUpForm = (req,res,next)=>{
  res.render('signupForm', {pageTitle: 'controllers-showSignUpForm'});
}

exports.showSignUpSuccess = [
  check('firstName')
  .notEmpty()
  .withMessage('First Name is required')
  .trim()
  .isLength({min:2})
  .withMessage('First name must be at least 2 charecters long')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('First name can only contain letters'),

  check('secondName')
  .notEmpty()
  .withMessage('Second Name is required')
  .trim()
  .isLength({min:2})
  .withMessage('Second name must be at least 2 charecters long')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('Second name can only contain letters'),
   
  check('password')
  .isLength({min:8})
  .withMessage('Password must be at least 8 charecters long')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('password must contain at least one special charecter')
  .trim(),

  check('confirm-password')
  .trim()
  .custom( (value, {req})=>{
   if(value !== req.body.password)
  {
    throw new Error('Password do not match')
  }
  return true;
  } ),

  (req,res,next)=>{
   const {firstName,secondName, password} = req.body;
   const errors = validationResult(req);

      //console.log(firstName,secondName,password);
      //console.log(errors.array().map(err=>err.msg));
      // res.render('logInForm',{pageTitle: 'logIn'});

  if(!errors.isEmpty())
  {
    return res.status(422).render('signupForm',
      {
        pageTitle:'controllers-showSignUpSuccess',
        isLoggedIn: false,
        errMsg : errors.array().map(err=>err.msg),
        oldInput: {
          firstName,
          secondName
        }
      }
    )
  }
  else{
    bcrypt.hash(password,10)
    .then(
            hashedPass=>{
            const rstdUsers = new registeredUser(
              { firstName,
                secondName,
                password:hashedPass}
            );
            rstdUsers.save().then(
            ()=>{
            res.render('logInForm', {pageTitle: 'controllers-showSignUpSuccess', errMsg: ''});
            })}
    )
    .catch(
            err=>{
            return res.status(422).render('signupForm',
            {
            pageTitle:'controllers-showSignUpSuccess',
            isLoggedIn: false,
            errMsg : [err.msg],
            oldInput: {
            firstName,
            secondName
            }
            }
            )
            }
      )
} 
    //res.render('logInForm', {pageTitle: 'controllers-showSignUpSuccess'});
  }
   
]

exports.showLoginForm = (req,res,next)=>{
  res.render('logInForm',{ pageTitle: 'controllers-showLoginPage'})
}

exports.showLoggedIn = async(req,res,next)=>{
    const {firstName,password} = req.body;
    const userFound =  await registeredUser.findOne({firstName});


          if(!userFound)
          {
            return res.status(422).render('logInForm',
            {
              pageTitle:'controllers-showLoggedIn',
              isLoggedIn: false,
              errMsg : ['User Not Found'],
              oldInput: {
              firstName }
            }
          )
          }

            const isMatch = await bcrypt.compare(password,userFound.password);
              if(!isMatch)
              {
                return res.status(422).render('logInForm',
                  {
                  pageTitle:'controllers-showLoggedIn',
                  isLoggedIn: false,
                  errMsg : ['Invalid Password'],
                  oldInput: {
                  firstName

                  }
                  }
              )
              }

  //res.cookie('isLoggedIn', true);
  req.session.isLoggedIn = true;
  req.session.user = userFound;
  console.log(req.session.user);
  console.log(req.session.isLoggedIn);
  //console.log("Session: ", req.session);
  res.render('loggedIn',{pageTitle: 'controllers-showLoggedIn'})
}

exports.loggedOut = (req,res,next)=>{
    req.session.isLoggedIn = false;
    //  res.cookie('isLoggedIn', false);
    // res.render("homePage", { pageTitle: "controllers-showHome", isLoggedIn:req.isLoggedIn });
    res.redirect('/');
}
exports.showHome = (req, res, next) => {
  console.log("isLoggedIn-session: ", req.session.isLoggedIn);
  res.render("homePage", { pageTitle: "controllers-showHome", isLoggedIn:req.isLoggedIn });
};
exports.showForm = (req, res, next) => {
  res.render("form", { pageTitle: "controllers-showForm" });
};
exports.saveDataAndShowSuccess = (req, res, next) => {
  const { stId, personName, deptName, gender, contactNo, address } = req.body;
// console.log(photo);
// console.log(req.file);
   const photo = req.file;
   //console.log(photo.filename);
  if(!req.file){
    console.log("no image provided");
    res.status(422).render('form', {pageTitle:'saveDataAndShowSuccess'});
    return;
  }
  const resultObj = new model(
    {stId,
    personName,
    photo: "uploads/"+photo.filename,
    deptName,
    gender,
    contactNo,
    address}
  );
  resultObj.save().then(() => {
    console.log("Data Saved to MongoDB Successfully!");
  });

  res.render("success", { pageTitle: "controllers-saveDataAndShowSuccess" , msg: "New entry done!"});
};
exports.showResult = (req, res, next) => {
  
  model.find().then((element) => {
    //console.log("hiii", element.photo);
    res.render("result", {
      pageTitle: "controllers-showResult",
      resultArray: element,
    });
  });
};
exports.showInfo = (req, res, next) => {
  const uniqueIdOfMongo = req.params._id;
  model.findById(uniqueIdOfMongo).then((element) => {
    console.log(element);
    res.render("studentInfo", {
      pageTitle: "showController.showInfo",
      studentDetails: element,
    });
  });
};
exports.showDeleteMsg = (req, res, next) => {
  const uniqueIdOfMongo = req.params._id;
  model.findByIdAndDelete(uniqueIdOfMongo).then((element) => {
    res.redirect("/result");
  });
};
exports.showEditForm = (req, res, next) => {
  const uniqueIdOfMongo = req.params._id;
  model.findById(uniqueIdOfMongo).then((element) => {
    console.log(element);
    res.render("editForm", { pageTitle: "showEditForm", data: element });
  });

};

 exports.saveEdit = (req, res, next) => {
  const { stId, personName, deptName, gender, contactNo, address } = req.body;
 // const photo = req.file;
  //console.log(photo);
  model.findById(req.params._id)
  .then(
    data=>{
      data.stId = stId;
      data.personName = personName;
      data.deptName = deptName;
      data.gender = gender;
      data.contactNo = contactNo;
      data.address = address;
     
      if(req.file){
      fs.unlink(data.photo, (err)=>{
        if(err)
        {console.log(err);}
      });

      data.photo = "uploads/"+req.file.filename;
    
    }
      

      data.save().then(
        ()=>{
          console.log('Edited');
        }
      )
      res.render( 'success', { pageTitle: 'saveEdit', msg: "Edited!"});

    }
  )
}; 


