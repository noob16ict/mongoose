const model = require("../model/onlyModel");
const { getDB } = require("../util/databaseUtil");
const { ObjectId } = require("mongodb");


exports.showLoginForm = (req,res,next)=>{
  res.render('logInForm',{ pageTitle: 'controllers-showLoginPage'})
}
exports.showLoggedIn = (req,res,next)=>{
  
  res.cookie('isLoggedIn', true);
  res.render('loggedIn',{pageTitle: 'controllers-showLoggedIn'})
}
exports.loggedOut = (req,res,next)=>{
  res.cookie('isLoggedIn', false);
  res.redirect('/');
}
exports.showHome = (req, res, next) => {
  res.render("homePage", { pageTitle: "controllers-showHome", isLoggedIn:req.isLoggedIn });
};
exports.showForm = (req, res, next) => {
  res.render("form", { pageTitle: "controllers-showForm" });
};
exports.saveDataAndShowSuccess = (req, res, next) => {
  const { stId, personName, deptName, gender, contactNo, address } = req.body;
  const resultObj = new model(
    {stId,
    personName,
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
    res.render("result", {
      pageTitle: "controllers-showResult",
      resultArray: element,
    });
  });
};
exports.showInfo = (req, res, next) => {
  const uniqueIdOfMongo = req.params._id;
  model.findById(uniqueIdOfMongo).then((element) => {
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
  model.findById(req.params._id)
  .then(
    data=>{
      data.stId = stId;
      data.personName = personName;
      data.deptName = deptName;
      data.gender = gender;
      data.contactNo = contactNo;
      data.address = address;
      data.save().then(
        ()=>{
          console.log('Edited');
        }
      )
      res.render( 'success', { pageTitle: 'saveEdit', msg: "Edited!"});

    }
  )
}; 


