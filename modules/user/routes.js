const router = require('express').Router()
const controller = require('./handler')
const {upload} = require('../../utils/uploads')

router.get('/register', controller.register)
router.post('/register', upload.single("photo"), controller.createUser)
router.get('/login', controller.register)

module.exports = router

