import mongoose from "mongoose";
import Cart from "../models/Cart.js";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },

    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Cart,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }

})

export default mongoose.model('User', userSchema);