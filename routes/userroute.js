const express = require('express');
const user_route  = express();
const session = require('express-session');


const config = require("../config/config")

user_route.use(session({secret:config.sessionSecret}));


const auth = require("../middleware/auth")

user_route.set('view engine' , 'ejs');
user_route.set('views' , './views/users')


const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');


user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req , file , cb){
        cb(null,path.join(__dirname , '../public/userimages'))
    },
    filename:function(req , file , cb){
        const name = Date.now()+ '-' + file.originalname;
        cb(null , name);
    }
})

const upload = multer({storage:storage})

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended : true}))

const usercontroller = require('../controllers/usercontroller');

user_route.get('/register' ,auth.isLogout, usercontroller.loadRegister);

user_route.post('/register' ,upload.single('image') ,usercontroller.insertuser);

user_route.get('/verify' , usercontroller.verifyMail);

user_route.get('/' ,auth.isLogout, usercontroller.loginload);
user_route.get('/login' ,auth.isLogout, usercontroller.loginload);
user_route.post('/login' , usercontroller.loginload);

user_route.post('/login' , usercontroller.verifylogin);

user_route.get('/home' , usercontroller.loadHome );


user_route.get('/logout', auth.isLogin , usercontroller.userLogout);


module.exports = user_route;