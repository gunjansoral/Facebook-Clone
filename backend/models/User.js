const mongoose = require('mongoose')

const objectId = mongoose.Schema.ObjectId

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname is required'],
        text: true,
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'lastname is required'],
        text: true,
        trim: true
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        text: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        text: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    picture: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_face,r_20,d_avatar.png/non_existing_id.png'
    },
    cover: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_face,r_20,d_avatar.png/non_existing_id.png',
    },
    gender: {
        type: String,
        required: [true, 'gender is required'],
        text: true,
    },
    bYear: {
        type: String,
        text: true,
        trim: true
    },
    bMonth: {
        type: String,
        text: true,
        trim: true
    },
    bDay: {
        type: String,
        text: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    friends: {
        tpe: Array,
        default: []
    },
    followers: {
        tpe: Array,
        default: []
    },
    following: {
        tpe: Array,
        default: []
    },
    requests: {
        tpe: Array,
        default: []
    },
    search: [
        {
            user: {
                type: objectId,
                ref: 'User'
            }
        }
    ],
    details: {
        bio: {
            type: String
        },
        otherName: {
            type: String
        },
        hometown: {
            type: String
        },
        currentCity: {
            type: String
        },
        job: {
            type: String
        },
        workplace: {
            type: String
        },
        school: {
            type: String
        },
        college: {
            type: String
        },
        relationship: {
            type: String,
            enum: ['Single', 'In a Relationship', 'Married', 'Divorced']
        },
        instagram: {
            type: String
        },
        savedPosts: [
            {
                post: {
                    type: objectId,
                    ref: 'Post'
                },
                savedAt: {
                    type: Date,
                    default: new Date()
                }
            }
        ]
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model('User', userSchema)