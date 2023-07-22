const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env

const auth = (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        res.status(403).send('Please login first')
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET)
        console.log(decode);
        req.user = decode
    } catch (error) {
        console.log(error);
        res.status(401).send('Invalid Token')
    }
    
    next()
}

module.exports = auth
