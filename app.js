var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require("cors")
 

var indexRouter = require('./routes/adminRouter');
var postRouter= require("./routes/postRouter")
var userRouter=require("./routes/userRouter")
var favRouter=require("./routes/favouriteRouter")
var fileUploadRouter=require("./routes/FileUploadRouter")
var commissionRouter=require("./routes/commissionRoute")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin:[
    // "http://localhost:3001","http://localhost:3000",
    "https://sundaramagency.vercel.app","https://sundaramagency-admin.vercel.app"],
  credentials:true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', indexRouter)
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/fav',favRouter)
app.use("/file",fileUploadRouter)
app.use("/commission",commissionRouter)
app.get("/",(req,res)=>{
  res.send("Hello")
})


app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
