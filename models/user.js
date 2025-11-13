import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin", "staff", "manager", "seller"],
    },
    //  
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },


    // ✅ الحقول الخاصة بالتحقق
    verificationCode: { type: String },
    verificationType: { type: String, enum: ["email_verification", "password_reset"] },
    verificationExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// تشفير كلمة المرور
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;