const User = require('../models/user')

const { errorHandler } = require('../helpers/dbErrorHandler')

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    return res.json(req.profile)
}

exports.listNeedHelp = (req, res) => {
    User.find({needDonationHelp:true})
        .select('_id username email needHelpDesc')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.update =(req, res)=>{
    const email = req.body.email
    User.findOne({email}).exec((err,oldUser)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        if(oldUser==null){
            return res.status(400).json({
                error: `User [${slug}] not found`
            })

        }
        const { keyName, keyValue } = req.body
        oldUser[keyName] = keyValue

        oldUser.save((err,result)=>{
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    }
    )
}
