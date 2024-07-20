const User = require('../model/User')
const bcrypt = require('bcrypt')

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
    const { name, email, password } = req.body
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