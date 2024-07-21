const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getAll = async (req, res) => {
    const allUsers = await User.findAll()
    if(allUsers.length != 0){
        res.status(200).send({
            allUsers
        })
    } else {
        res.status(404).send({
            message: 'No users found.'
        })
    }
}

exports.create = async (req, res) => {
    //Recolhe dados
    const { name, email, password, passwordConfirm } = req.body

    //Checa existência destes dados
    if(!name || !email || !password || !passwordConfirm){
        res.status(201).send({
            message: `Some field(s) are empty.`
        })
    }

    //Valida estes dados
    const errors = {}
    if (!String(name).trim()) {
        errors.name = 'Name is required'
    } else {
        if ((name.trim().length < 3 || name.trim().length > 60)) {
            errors.name = 'Invalid Name'
        }
    }
    if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
        errors.email = 'Email is not valid.'
    }
    if ((password.trim().length < 5 || password.trim().length > 25)) {
        errors.password = 'Password is not valid'
    }
    if (password != passwordConfirm) {
        errors.passwordConfirm = 'Passwords does not match'
    }
    if(Object.keys(errors).length >= 1){
        errors.nameInput = name
        errors.emailInput = email
        return res.status(422).send({
            message: 'Some field(s) are not valid.',
            result: errors
        })
    }

    //Cria usuário
    const foundUser = await User.findOne({where:{email: email}})
    if(!foundUser){
        return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    name: name.trim(),
                    email: email.trim(),
                    admin: 0    ,
                    password: hashedPassword
                })
                user.save()
                res.status(201).send({
                    message: `User ${name.trim()} created!`
                })
            })
    } else {
        res.status(409).send({
            message: `Email already exists`
        })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({where: {email: email}})
    if(user){
        const passwordCheck = bcrypt.compare(password, user.password)
        if(passwordCheck){
            const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  admin: user.admin
                },
                "RANDOM-TOKEN",
                { expiresIn: process.env.TOKEN_EXPIRES_IN }
            );
            res.status(200).send({
                message: "Login Successful",
                email: user.email,
                token,
            })
        } else {
            res.status(404).send({
                message: 'This email is not registered.'
            })
        }
    }
}

exports.dashboard = (req, res) => {
    res.status(201).send({
        message: 'Ok!',
        user: req.user
    })
}