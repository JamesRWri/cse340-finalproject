import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import masterRouter from './routes/index.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.loggedin = true;
    res.locals.accountData = { 
        account_id: 1, 
        account_firstname: "James", 
        account_lastname: "User",
        account_role: "Owner" 
    };
    
    req._mockFlashes = req._mockFlashes || {};

    req.flash = function(type, message) {
        if (message) {
            req._mockFlashes[type] = message;
        } else {
            const val = req._mockFlashes[type];
            delete req._mockFlashes[type];
            return val || '';
        }
    };

    res.locals.messages = {
        notice: req.flash('notice')
    };
    next();
});

app.get('/', (req, res) => {
    res.redirect('/vehicles/inventory');
});

app.use(masterRouter);

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