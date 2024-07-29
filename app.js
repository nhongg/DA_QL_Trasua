var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var dichvuRouter = require('./routes/dichvu');
var congviecRouter = require('./routes/congviec');
var thongkeRouter = require('./routes/thongke');
var khachhangRouter = require('./routes/khachhang');
var nhanvienRouter = require('./routes/nhanvien');
var hoadonRouter = require('./routes/hoadon');
var hoadonchitietRouter = require('./routes/hoadonchitiet');
var newpassRouter = require('./routes/newpass');

var app = express();
var database = require('./config/db');

const PORT = 3000;
const HOST = "192.168.1.9";  // dia chi wifi

app.listen(PORT,HOST, () => { 
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/dichvus', dichvuRouter);
app.use('/congviecs',congviecRouter)
app.use('/thongke',thongkeRouter)
app.use('/khachhangs',khachhangRouter)
app.use('/nhanviens',nhanvienRouter)
app.use('/hoadons',hoadonRouter)
app.use('/hoadonchitiets',hoadonchitietRouter)
app.use('/newpass',newpassRouter)

database.connect();
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
   