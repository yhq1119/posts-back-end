const express = require('express')
const router = express.Router()
const { authMiddleware,adminMiddleware, requireSignin } = require('../controllers/auth')
const { read, listNeedHelp, update } = require('../controllers/user')



router.get('/user/profile',
    requireSignin, 
    authMiddleware, 
    read)

router.get('/user/needhelp',listNeedHelp)

router.post('/user/update',requireSignin,authMiddleware,update)

module.exports = router