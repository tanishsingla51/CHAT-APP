import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {

    const { email, fullName, password } = req.body;
   
   try {

    if(!email || !fullName || !password){
        return res.status(400).json({message: 'All fields are required'});
    }

    if(password.length < 6){
        return res.status(400).json({message: 'Password must be at least 6 characters long'});
    }

    const user = await User.findOne({
        email
    });

    if(user){
        return res.status(400).json({message: 'User already exists'});
    }

    const salt = await bcrypt.genSalt(10); // what is salt? ans 
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        fullName,
        password: hashedPassword
    });

    if(newUser){
        
        generateToken(newUser._id, res); 
        await newUser.save();
        
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic, 
        });

   }else{
    res.status(500).json({message: 'Invalid user data'});
   }

}
   catch (error) {
    
    res.status(500).json({message: 'SIGNUP ERROR: ' + error.message});
   }
}

export const login = async (req, res) => {
    
    const { email, password } = req.body;

    try {

        const user = await User.findOne({
            email
        });

        if(!user){
            return res.status(400).json({message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password); // compare the password entered by the user with the hashed password in the database.

        if(!isMatch){

            return res.status(400).json({message: 'Invalid Password'});
        }

        generateToken(user._id, res);

         res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });

    } catch (error) {
        res.status(500).json({message
            : 'LOGIN ERROR: ' + error
        });
    }
}

export const logout =  (req, res) => {  
    
    try {

        res.clearCookie('jwt');
        res.status(200).json({message: 'Logged out successfully'});
        
    } catch (error) {

        res.status(500).json({message: 'LOGOUT ERROR: ' + error.message});
        
    }
}

export const updateProfile = async (req, res) => {

    try {

        const { profilePic } = req.body;
        const userId = req.user._id;  

        if(!profilePic){
            return res.status(400).json({message: 'Profile picture is required'});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
        
        res.status(200).json(updatedUser);
    } catch (error) {

        console.log(error);

        res.status(500).json({message: 'UPDATE PROFILE ERROR: ' + error.message});
        
    }
}

export const checkAuth = async (req, res) => {

    try {

        res.status(200).json(req.user);
        
    } catch (error) {

        res.status(500).json({message: 'CHECK AUTH ERROR: ' + error.message});
        
    }

}