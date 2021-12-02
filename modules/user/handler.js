const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const model = require('./model')
require('dotenv').config()
const {SECRET} = process.env

exports.register = (req, res) => {
    res.render('pages/register')
}

exports.createUser = async (req, res) => {
    let { username, classId, password, cpassword} = req.body
    let photo = req.file === undefined || null ? "nopic.jpg" : req.file.filename;
    // let isAdmin = role == "admin" ? true : false;
    // let isTeacher = role == "teacher" ? true : false;
    let date = new Date()
    console.log(date.getFullYear)
    // let student_id = `FDS/${date.getFullYear}/${classId}/`
    let data = {
        username, classId, password, cpassword, photo
    }
    let payload = {username}
    let token = await jwt.sign(payload, SECRET,{ expiresIn: 3600 })
    model.register(data)

    console.log(data)
    res.status(200).json({ ok: true, message: 'user created', data, token})
}

exports.login = (req, res) => {
    res.render('pages/login')
}