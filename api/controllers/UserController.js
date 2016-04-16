var User = require('../models').User;

module.exports = {
    index(req, res){
        res.json({status: 'Le user'})
    },
    seed(req, res){
        User.seed();
        res.send({status: 'alright'})  
    },
    create(req, res){}
}
