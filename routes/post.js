const express = require('express')
const router = express.Router()
const { create,list, read, update, remove,photo } = require('../controllers/post')
const { requireSignin, adminMiddleware } = require('../controllers/auth')

router.post('/post', requireSignin, adminMiddleware, create)
router.get('/post', list)
router.get('/post/:slug', read)
router.put('/post/:slug', requireSignin, adminMiddleware, update)
router.patch('/post/:slug', requireSignin, adminMiddleware, update)
router.delete('/post/:slug', requireSignin, adminMiddleware, remove)
router.get('/post/:slug/photo',photo)

module.exports = router