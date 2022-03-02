import passport from "passport";
import local from "passport-local"
//import fbStrategy from "passport-facebook"
import { isValidPassword } from "./utils.js"
import { createHash } from "./utils.js"
import {users} from "./daos/users/userMongo.js";

const LocalStrategy = local.Strategy

export const initializePassport = () => {
    passport.use("register", new LocalStrategy({passReqToCallback: true}, async (req,username,password,done)=> { //passReq es para que tome mi req como argumento en la function
        try {
            console.log("foto:", req.file)/////////////////////////////////////////
            console.log("registrando usuario")////////////////////////////////////////////////
            let user = await users.findOne({id:username})
            if (user) return done(null,false, {message:"usuario ya registrado"})
            const newUser = {
                id: username,
                name: req.body.name,
                last_name: req.body.last_name,
                age: req.body.age,
                alias: req.body.alias,
                adress: req.body.adress,
                phone: req.body.phone,
                avatar: "not avaliable",
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

/* const initializePassportConfig= async () => {
    passport.use("facebook", new FacebookStrategy({
        clientID: "1130850957701584",                                                
        clientSecret: "c3a0d3c2f2dba2af65aad41fe1a7e567",
        callbackURL: "https://e268-190-17-8-82.ngrok.io/auth/facebook/callback",     
        profileFields: ["emails","displayName","photos"]
    }, async (accessToken, refreshToken, profile, done)=> {
        try {
            let user = await users.findOne({id:profile.emails[0].value})
            const facebookProfile = {
                displayName: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos[0]
            } 
            done(null,user,facebookProfile)
        } catch (err) {
            console.log(err)
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
 */
export default initializePassport