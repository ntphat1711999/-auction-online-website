const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const bcrypt = require('bcryptjs');

// download avt
const downloader = require('image-downloader');
// validating input
const { validationResult } = require('express-validator');
// models
const User = require('../models/User');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // google
    passport.use('google', new GoogleStrategy(
        {
            clientID: '12967611420-1s5chcrdiect57lnroojpudd40efu1jf.apps.googleusercontent.com',
            clientSecret: 'dr4V9vI6RTGf_y36rCdrTsGg',
            callbackURL: 'http://localhost:5000/login/google'
        },
        async (token, tokenSecret, profile, done) => {
            try {
                const user = await User.findOne({ method: 'google', authId: profile.id });
                if (!user) {
                    // create user
                    const newUser = new User({
                        method: 'google',
                        authId: profile.id,
                        isVerified: profile._json.email_verified,
                        profile: {
                            name: profile._json.name,
                            email: profile._json.email
                        }
                    })
                    await newUser.save();
                    // download image
                    downloader({
                        url: profile._json.picture,
                        dest: './public/images/users/' + newUser.id + '.jpg'
                    });
                    return done(null, newUser);
                }
                done(null, user);
            } catch (error) {
                console.error(error.message);
            }
        }
    ))

    // passport facebook
    passport.use('facebook', new FacebookStrategy(
        {
            clientID: '456309121713655',
            clientSecret: 'c1b9fa178b8f6003bcbef610a699acfb',
            profileFields: ['email', 'displayName', 'picture.type(large)'],
            callbackURL: 'http://localhost:5000/login/facebook'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ method: 'facebook', authId: profile.id });
                if (!user) {
                    // create user
                    const newUser = new User({
                        method: 'facebook',
                        authId: profile.id,
                        isVerified: true,
                        profile: {
                            name: profile._json.name,
                            email: profile._json.email
                        }
                    });
                    await newUser.save();
                    // download image
                    downloader({
                        url: profile._json.picture.data.url,
                        dest: './public/images/users/' + newUser.id + '.jpg'
                    });
                    return done(null, newUser);
                }
                done(null, user);
            } catch (error) {
                console.error(error.message);
            }
        }
    ))

    // passport login
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                const user = await User.findOne({ method: 'local', authId: username });
                if (!user) {
                    return done(null, false, { message: 'Tài khoản chưa đăng ký' });
                }
                const isMatch = await bcrypt.compare(password, user.secret);
                if (isMatch) {
                    done(null, user);
                } else {
                    done(null, false, { message: 'Sai mật khẩu' });
                }
            } catch (error) {
                console.error(error.message);
            }
        }
    ))
    // passport register
    passport.use('register', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            // input valid
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return done(null, false, { message: errors.array()[0].msg });
            }

            const { name, email, address } = req.body;

            try {
                const user = await User.findOne({ method: 'local', authId: username });
                if (user) {
                    return done(null, false, { message: 'Tài khoản đã tồn tại' });
                }
                const profile = await User.findOne({ method: 'local', 'profile.email': email });
                if (profile) {
                    return done(null, false, { message: 'Email đã tồn tại' });
                }
                // hash password
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);
                // new user
                const newUser = new User({
                    profile: { name, email, address },
                    authId: username,
                    secret: password
                });
                await newUser.save();
                done(null, newUser);
            } catch (error) {
                console.error(error.message);
            }
        }
    ));
}