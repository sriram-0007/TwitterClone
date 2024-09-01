import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";
export const signup=async(req,res)=>{
    try{
        const {fullName,username,email,password}=req.body;
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email format"});
        }
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.staus(400).json({error:"Username is already taken"});
        }
        const existingEmail=await User.findOne({email});
        if(existingEmail){
            return res.staus(400).json({error:"Email already Exists"});
        }

        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);


        const newUser=new User({
            fullName,
            username,
            email,
            password:hashedPassword
        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg
            })
        }else{
            res.staus(400).json({error:"Invalid user data"});
        }
    }catch(error){
        res.status(500).json({error:"Something went wrong in the server"});
    }
}

export const login=async(req,res)=>{
    res.json({
        data:"You hit the login endpoint"
    });
}

export const logout=async(req,res)=>{
    res.json({
        data:"You hit the logout endpoint"
    });
}