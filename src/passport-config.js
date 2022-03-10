import passport from "passport";
import local from "passport-local"
//import fbStrategy from "passport-facebook"
import { isValidPassword } from "./utils.js"
import { createHash } from "./utils.js"
import {users} from "./daos/users/userMongo.js";

const LocalStrategy = local.Strategy

export const initializePassport = () => {
    passport.use("register", new LocalStrategy({passReqToCallback: true}, async (req,username,password,done)=> { //passReq es para que tome mi req como argumento en la function
        let {name,last_name,age,alias,adress,phone} = req.body
        try {
            let user = await users.findOne({id:username})
            if (user) return done(null,false, {message:"usuario ya registrado"})
            const newUser = {
                id: username,
                name,
                last_name,
                age,
                alias,
                adress,
                phone,
                avatar: req.protocol+"://"+req.hostname+":8080"+"/images/"+req.file.filename,
                password: createHash(password)
            }
            try {
                let result = await users.create(newUser)
                done(null,result)
            } catch (err) {
                return done(err)
            }
        } catch (err) {
            return done(err)
        }
    }))
    passport.use("login", new LocalStrategy(async(username,password,done)=> {
        try {
            let user = await users.findOne({id:username})
            if (!user) return done(null,false, {message: "user not found"})
            if(!isValidPassword(user,password)) return done(null,false,{message:"invalid password"})
            return done(null,user)
        } catch (err) {
            done(err)
        }
    }))
    passport.serializeUser((user,done)=> {
        done(null,user._id)
    })
    passport.deserializeUser((id,done)=> {
        users.findById(id,done)
    })
}

export default initializePassport