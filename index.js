const flash = require('express-flash')
const session = require('express-session')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const registrationNumbers = require('./registration-numbers-factory')
const RegistrationRoutes = require('./registration-numbers-routes')

const pg = require('pg')
const Pool = pg.Pool


let useSSL = false
let local = process.env.LOCAL || false

if (process.env.DATABASE_URL && !local) {
    useSSL = true
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_numbers'

const pool = new Pool({
    connectionString,
    ssl: useSSL
})


let app = express()

app.use(session({
    secret: 'This is a secret message',
    resave: false,
    saveUninitialized: true
}))
app.use(flash());

let registrationNumbersInstance = registrationNumbers(pool)
let registrationRoutes = RegistrationRoutes(registrationNumbersInstance)

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())


app.get("/", registrationRoutes.index);

app.get("/reg_number", registrationRoutes.registration_numbers_get);
app.post("/reg_number", registrationRoutes.registration_numbers_post);
app.get("/reg_number/:plate", registrationRoutes.registration_numbers_post);
app.get("/reg_numbers/:location", registrationRoutes.registration_numbers_get);


let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
    console.log('Registration Numbers WebApp started successfully and is now running on port: ', PORT);
});
