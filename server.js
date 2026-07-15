import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';

import baseRoute from './src/routes/baseRoute.js';
import vehicleRoute from './src/routes/vehicleRoute.js';
import categoryRoute from './src/routes/categoryRoute.js';
import accountRoute from './src/routes/accountRoute.js';
import reviewRoute from './src/routes/reviewRoute.js';
import adminRoute from './src/routes/adminRoute.js';
import contactRoute from './src/routes/contactRoute.js';
import serviceRoute from './src/routes/serviceRoute.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true, 
    sameSite: "lax", 
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin || false;
  res.locals.accountData = req.session.user || null;
  next();
});

app.use((req, res, next) => {
    res.locals.messages = {
        notice: req.flash('notice')
    };
    next();
});

app.use('/', baseRoute);
app.use('/vehicles', vehicleRoute);
app.use('/categories', categoryRoute);
app.use('/account', accountRoute);
app.use('/review', reviewRoute);
app.use('/admin', adminRoute);
app.use('/contact', contactRoute);
app.use('/service', serviceRoute);

app.use((req, res, next) => {
    const err = new Error("The requested vehicle resource or page could not be found.");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    console.error(`[Error ${status}]: ${err.message}`);
    
    res.status(status).send(`
        <div style="font-family: sans-serif; padding: 3rem; text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Error ${status}</h1>
            <p style="font-size: 1.25rem; color: #555;">${err.message || 'Something failed inside the dealership server.'}</p>
            <hr style="max-width: 400px; margin: 2rem auto; border: 1px solid #eee;">
            <a href="/vehicles/inventory" style="color: #000; font-weight: bold; text-decoration: underline;">Return to Main Lot Inventory</a>
        </div>
    `);
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Dealership management server actively listening on port ${PORT}`);
});