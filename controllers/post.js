const Post = require('../models/post')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const { errorHandler } = require('../helpers/dbErrorHandler')
const fs = require('fs')
const { smartTrim } = require('../helpers/blog')


exports.create = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }

        const { title, body } = fields

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'Title is required'
            })
        }

        if (!body || body.length < 12) {
            return res.status(400).json({
                error: 'Content is too short'
            })
        }

        let post = new Post()
        post.title = title
        post.body = body
        post.excerpt = smartTrim(body, process.env.BLOG_EXCERPT_LENGTH, " ", "...")
        post.slug = slugify(title + " " + new Date().toUTCString()).toLowerCase()
        post.mtitle = `${title} | ${process.env.APP_NAME}`
        post.mdesc = stripHtml(body.substring(0, 160))
        post.postedBy = req.user._id
        post.hasExpired = false

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should < 1MB to upload'
                });
            }
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            // res.json(result)
            Post.findByIdAndUpdate(result._id,  { new: true }).exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                } else {
                    Post.findByIdAndUpdate(result._id, { new: true }).exec((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        } else {
                            res.json(result)
                        }
                    })
                }
            })
        })

    })
}



exports.list = (req, res) => {
    Post.find({})
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })

}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    Post.findOne({ slug })
        .populate('postedBy', '_id name username')
        .select('_id title slug mtitle mdesc excerpt body postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })

}

exports.update = (req, res) => {

    const slug = req.params.slug.toLowerCase()
    Post.findOne({ slug }).exec((err, oldPost) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        if (oldPost == null) {
            return res.status(400).json({
                error: `Post [${slug}] not found`
            })
        }
        // console.log(oldPost);
        let form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                })
            }

            // let slutBeforeMerge = oldPost.slug
            oldPost = _.merge(oldPost, fields)
            // oldPost.slug = slutBeforeMerge


            const { title, body } = fields


            if (body) {
                oldPost.excerpt = smartTrim(body, 320, " ", "...")
                oldPost.mdesc = stripHtml(body.substring(0, 160))
            }


            // if (title) {
            //     oldPost.title = smartTrim(body, 320, " ", "...")
            //     oldPost.mdesc = stripHtml(body.substring(0, 160))
            // }


            if (!title || !title.length) {
                return res.status(400).json({
                    error: 'Title is required'
                })
            }

            if (!body || body.length < 12) {
                return res.status(400).json({
                    error: 'Content is too short'
                })
            }

        

            // let blog = new Blog()
            // Post.title = title
            // Post.body = body
            // Post.excerpt = smartTrim(body, process.env.BLOG_EXCERPT_LENGTH, " ", "...")
            oldPost.slug = slugify(title + " " + new Date().toUTCString()).toLowerCase()
            oldPost.mtitle = `${title} | ${process.env.APP_NAME}`
            // Post.mdesc = stripHtml(body.substring(0, 160))
            // Post.postedBy = req.user._id

            // categories and tags
            // let arrayOfCategories = categories && categories.split(',')

            // let arrayOfTags = tags && tags.split(',')

            if (files.photo) {
                if (files.photo.size > 1000000) {
                    return res.status(400).json({
                        error: 'Image should < 1MB to upload'
                    });
                }

                oldPost.photo.data = fs.readFileSync(files.photo.path)
                oldPost.photo.contentType = files.photo.type
            }

            oldPost.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json(result)
            })
        })
    })

}
exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    Post.findOneAndRemove({ slug })
        .exec((err, data) => {
            if (err) {

                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json({
                message: `Post [${slug}] deleted successfully`
            })

        })

}

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Post.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
                return res.status(400).json({
                    error: err
                });
            }
            res.set('Content-Type', Post.photo.contentType);
            return res.send(Post.photo.data);
        });
};
