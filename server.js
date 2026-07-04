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
    res.locals.loggedin = true; // Set to false to test out logged-out view
    res.locals.accountData = { account_id: 1, account_firstname: "James", account_lastname: "User" };
    res.locals.messages = {};
    next();
});

app.use(masterRouter);

app.get('/', (req, res) => {
    res.redirect('/vehicles/inventory');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something failed inside the dealership server routing system.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Dealership management server actively listening on port ${PORT}`);
});