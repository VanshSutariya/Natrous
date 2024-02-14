const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appErrors');
const globalErrorController = require('./controller/errorController');
const app = express();
console.log(process.env.NODE_ENV);

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

//devlopment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit request from same API
const limiter = rateLimiter({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP , please try again in a hour ',
});
app.use('/api', limiter);
// body paser , reading data from body to req.body
app.use(express.json({ limit: '10kb' })); // read data upto 10kb

// Data sanitization against NoSql query injection
app.use(mongoSanitize());
// Data sanitization against XSS (cross site )
app.use(xss());

// prevent paramater pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// serving static files
app.use(express.static(`${__dirname}/public`));

/*
app.use((req, res, next) => {
  console.log('Hello i am a middleWare..');
  next();
});
*/

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', AllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server `, 404));
});

app.use(globalErrorController);
module.exports = app;
