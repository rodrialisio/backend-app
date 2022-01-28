import passport from "passport";
import fbStrategy from "passport-facebook"
//import {users} from "./app.js";
import {users} from "./daos/users/userMongo.js";

const FacebookStrategy = fbStrategy.Strategy

const initializePassportConfig= () => {
    passport.use("facebook", new FacebookStrategy({
        clientID: "1130850957701584",                                                //se obtiene de www.developers.facebook
        clientSecret: "c3a0d3c2f2dba2af65aad41fe1a7e567",
        callbackURL: "https://e268-190-17-8-82.ngrok.io/auth/facebook/callback",     //lo genera ngrok
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

export default initializePassportConfig