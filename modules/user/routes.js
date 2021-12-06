const router = require('express').Router()
const controller = require('./handler')
const {upload} = require('../../utils/uploads')

router.get("/generateTable", controller.createTable);
router.get('/register', controller.register)
router.post('/register', upload.single("photo"), controller.createUser)
router.get('/login', controller.loginPage)
router.post('/login', controller.login)
router.get('/all', controller.getUsers)

module.exports = router

