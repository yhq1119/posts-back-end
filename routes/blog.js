const express = require('express')
const router = express.Router()
const { create,list, listAllBlogsCategoriesTags, read, update, remove,photo, listRelated } = require('../controllers/blog')
const { requireSignin, adminMiddleware } = require('../controllers/auth')

router.post('/blog', requireSignin, adminMiddleware, create)
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags)
router.get('/blog', list)
router.get('/blog/:slug', read)
router.put('/blog/:slug', requireSignin, adminMiddleware, update)
router.patch('/blog/:slug', requireSignin, adminMiddleware, update)
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove)
router.get('/blog/:slug/photo',photo)
router.post('/blog/related',listRelated)

module.exports = router