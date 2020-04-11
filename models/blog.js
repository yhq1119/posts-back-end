const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        min: 3,
        max: 255,
        index: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    body: {
        type: {},
        trim: true,
        min: 4,
        max: 2000000,
        required: true
    },
    excerpt: {
        type: String,
        max: 1000
    },
    mtitle: {
        type: String,
    },
    mdesc: {
        type: String
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    categories: [{
        type: ObjectId,
        ref: 'Category',
        required: true
    }],
    tags: [{
        type: ObjectId,
        ref: 'Tag',
        required: true
    }],
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true })




module.exports = mongoose.model('blog', blogSchema)