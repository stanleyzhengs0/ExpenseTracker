// Controllers hold the actual logic of what happens when someone calls a route.
// this case: handle authentication logic routes

const jwt = require("jsonwebtoken");
const User = require('../models/User')

// Generate JWT Token
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "1h"});
}

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body; 

    // Step 1: Validation: check for missing fields
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        // Step 2: Check if email already exists
        const exsistingUser = await User.findOne({email});
        if(exsistingUser){
            return res.status(400).json({message: "Email already in use"});
        }

        // Step 3: Create new user
        const user = await User.create({
            fullName, 
            email, 
            password, 
            profileImageUrl
        });

        res.status(201).json({
            id: user._id, 
            user, 
            token: generateToken(user._id),
        });

    }catch(err){
        res.status(500).json({message: "Error registering user: ", Error: err.message})
    }
    
}

// Login User
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    // 1. check all fields entered
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        // 2. find user to login
        const user = await User.findOne({email})
        // 3. validate password
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message: "Invalid credentials"})
        }
        // 4. return success
        res.status(200).json({
            id: user._id, 
            user, 
            token: generateToken(user._id)
        })
    }catch(err){
        res.status(500).json({message: "Error signing in user: ", Error: err.message})
    }
}

// Get User info
exports.getUserInfo = async (req, res) => {

    try{
        // 1. Find the user
        const user = await User.findById(req.user.id).select("-password");
        // 2. Check if a user exsits
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        // 3. return user
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: "Error finding user: ", Error: err.message})
    }
}


