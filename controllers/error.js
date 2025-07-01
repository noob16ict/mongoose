exports.showErrorMsg = (req,res,next)=>{
  res.status(404).render('error', {pageTitle: 'ErrorForNoReason'});
}