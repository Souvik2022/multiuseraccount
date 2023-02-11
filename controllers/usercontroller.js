const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const { updateOne } = require('../models/usermodel');


//the password hashing code is given here
const securePassword = async(password)=>{

    try{

       const passwordhash = await bcrypt.hash(password , 10);
       return passwordhash;

    }catch(error){
        console.log(error.message)
    }
} 

//for sending mail
const sendVerifyMail = async (name , email , user_id)=>{

    try{

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure : false,
            requireTLS : true,
            auth : {

                user:'', //mention your gmail
                pass: '' // mention a password
            }
        });
        const mailoptions = {
            from: 'panditsouvik50@gmail.com',
            to: email,
            subject: 'For verification mail',
            html: '<p>Hi '+name+ ',please click here to <a href = "http://127.0.0.1:3000/verify?id= '+user_id+'">Verify </a> your mail.</p>'
        }
        transporter.sendMail(mailoptions,function(error , info){
            if(error){
                console.log(error);
            }else{
                console.log('email has beed sent',info.response)
            }
        })

    }catch(error){
        console.log(error.message);
    }

}
 

const loadRegister = async (req, res) => {
    try{

        res.render('registration')

    }catch(error){
        console.log(error.message);
    }
}


const insertuser = async(req, res) => {
    try{

        const spassword = securePassword(req.body.password);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            mobile : req.body.mno,
            image:req.file.filename,
            password: req.body.password,
            is_admin : 0
            

        })

        const userdata = await user.save();


        if(userdata){
            sendVerifyMail(req.body.name , req.body.email, userdata._id); 
            res.render('registration' , {message:"your registration is successfully saved"})
        }else{
            res.render('registration', {message:"failed"})
        }

    }catch(error){
        console.log(error.message);
    }
}

const verifyMail = async(req, res)=>{

    try{

        const updatedInfo = await User.updateOne({_id:req.query.id},{$set:{ is_varified:1} });

        console.log(updatedInfo);
        res.render("email-verified");

    }catch(error){
        console.log(error.message);
    }
}

//login user method

const loginload = async(req, res) => {

    try{

        res.render('login')

    }catch(error){
        console.log(error.message);

    }
}


const verifylogin = async(req, res) => {
    try{


        const email = req.body.email;
        const password = req.body.password;


        const userData = await User.findOne({email: email});

        if(userData){

           const passwordmatch = await bcrypt.compare(password, userData.password);
            if(passwordmatch){
                if(userData.is_varified === 0){
                    res.render('login');
                }else{
                    req.session.user_id = userData._id;
                    res.redirect('/home');

                }

            }else{
                res.render('login' ,  {message : "email and password is incorrect"})
            }
        }else{
            res.render('login' ,  {message : "email and password is incorrect"})
        }
    }catch(error){
        console.log(error.message);
    }
}


const loadHome = async(req, res) => {
    try{
       const userData = await User.findById({_id:req.session.user_id})
        res.render('home' , {user:userData});
    }catch(error){
        console.log(error.message);

    }
}


const userLogout = async(req, res) => {

    try{

        req.session.destroy();
        res.redirect('/');

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertuser,
    verifyMail,
    loginload,
    verifylogin,
    loadHome,
    userLogout
}