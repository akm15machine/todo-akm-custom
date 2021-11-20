const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const users = require("../Models/users");


if(!process.env.NODE_ENV){
    dotenv.config({ path: `.env.production` });
} else {
    dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}


module.exports = async (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) return res.status(400).json({ message: "Authentication Header Not Found" });

    token = token.split(" ")[1]; //only the token

    try {
        let decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET || "supersecretkeyrembertohide"
        );

        if (!decoded)
            return res.status(400).json({ message: "Expired or Invalid token" });

        const user = await users.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid User correspondence" });
        }

        // ATTACH USER TO BODY
        req.body.email = decoded.email;
        req.body.user_id = decoded.user_id;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Failed verifying Token", error });
    }
};