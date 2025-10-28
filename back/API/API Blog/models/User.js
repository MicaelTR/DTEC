const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true,
            select: false
            
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.mathPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);