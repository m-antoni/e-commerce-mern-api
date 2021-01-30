const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const os = require('os');


const app = express();

// Conenct Database
connectDB();

// set security http headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());


// Define Routes
app.get('/', (req, res) => {

    const data = {
        name: 'E-Commerce api (MERN Stack)',
        details: { node: process.version, platform: `${os.type()}, ${os.platform()}`, cpu: os.cpus().length, memory: Math.round( os.totalmem() / 1024 / 1024 ) }
    };

    res.json(data);
})


app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/users.route'));
app.use('/api/carts', require('./routes/cart.route'));
app.use('/api/shipping', require('./routes/shipping.route'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

