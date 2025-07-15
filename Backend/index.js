const express= require('express');
const dotenv= require('dotenv');
const app= express();
dotenv.config();
const cors=require('cors');
const session=require('express-session');
const flash=require('connect-flash');
const connectDB = require('./src/db/index.js');
const cookieParser=require('cookie-parser');
const admin=require('./src/Routes/adminRoute.js');
const doctor=require('./src/Routes/doctorRoute.js');
const patient=require('./src/Routes/patient.js');  // Added patient routes import
app.use(express.urlencoded({ extended: true })); // for form data (HTML forms)
app.use(express.json()); // for JSON data (like from Postman)
app.use(cookieParser());

// Updated CORS configuration to allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://hospital-managment-lzqampp4w-sairajs-projects-0ce2375b.vercel.app',
  'https://hospital-managment-ruby.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

connectDB();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none'
  }
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.token = req.session.token || null; // token is available to all views
  next();
});
app.get('/test-session', (req, res) => {
  res.json({ session: req.session });
});
app.use('/admin', admin); 
app.use('/doctor', doctor);
app.use('/patient', patient);  // Added patient routes mounting

app.listen(process.env.PORT, () => {
    console.log(`localhost:${process.env.PORT}`);
});
