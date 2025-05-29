const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['token'] || req.cookies['token'];
    

    if (!token) {
        return res.status(401).json({ status: "Unauthorized", message: "No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "Unauthorized", message: "Failed to authenticate token." });
        } else {
            const { _id, mobile, name } = decoded.data;

            req.headers.user_id = _id;
            req.headers.mobile = mobile;
            req.headers.name = name;
            
            next();
        }
    });
};