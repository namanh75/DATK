const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const route = require('./routes')
const db = require('./config/database/index')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const pascalCase=require('string-helper')
const nodemailer = require('nodemailer')
const multer  = require('multer')
const app = express()
//public file
app.use(express.static(path.join(__dirname, 'public')))

//morgan
app.use(morgan('combined'))

//views engine
app.engine('handlebars', handlebars({
    helpers: {
        //change role
        changerole: function(role){
            if(role == 1) return 'User'
            if(role == 2) return 'Doctor'
            if(role == 3) return 'Admin'
        },
        //count start 1
        count: function(index){  
            return index+=1
        },
        //get time
        gettime: function(){
            return new Date()
        },
    }
}))
app.set('view engine', 'handlebars') 
app.set('views',path.join(__dirname, 'resources/views'))

//body parser
app.use(bodyParser.urlencoded({extended: true}))

//upload file
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'src/public/uploads' )
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname)
    }
})
var upload = multer({storage: storage}).single('avatar')
//cookies
app.use(cookieParser())

//use other method (PUT, DELETE)
app.use(methodOverride('_method'))

//routing
route(app)

//connect
db.connect()

//listen
const port = 5000

app.get('/test', function(req, res) {
    res.render('site/test') 
})
app.post('/test', function(req, res) {
    upload(req, res, function(err){
        if(err) {
            console.log(err)
            return res.end('err')
        }
        res.end('upload successfully')
    })
    
})
app.listen(port, function(error){
    if (error) {
        console.log("Something went wrong");
    }
    console.log("server is running port:  " + port);
})