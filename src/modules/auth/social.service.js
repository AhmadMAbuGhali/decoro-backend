// src/modules/auth/social.service.js
import User from "../../models/user.model.js";
import ApiError from "../../core/errors/ApiError.js";
import generateTokenForUser from "../../utils/generateToken.js";
import { verifyGoogleIdToken, verifyFacebookToken, verifyAppleIdToken } from "../../utils/socialVerify.js";

class SocialAuthService {
  async handleSocialLogin(provider, token, { ip = "", userAgent = "" } = {}) {
    let profile;
    if (provider === "google") {
      profile = await verifyGoogleIdToken(token);
    } else if (provider === "facebook") {
      profile = await verifyFacebookToken(token);
    } else if (provider === "apple") {
      profile = await verifyAppleIdToken(token);
    } else {
      throw new ApiError(400, "Unsupported provider");
    }

    if (!profile || !profile.email) {
      throw new ApiError(400, "Email not provided by provider");
    }

    // Find user by email
    let user = await User.findOne({ email: profile.email });

    if (user) {
      // Link provider id if not linked
      const update = {};
      if (provider === "google" && !user.googleId) update.googleId = profile.id;
      if (provider === "facebook" && !user.facebookId) update.facebookId = profile.id;
      if (provider === "apple" && !user.appleId) update.appleId = profile.id;

      if (profile.name && !user.name) update.name = profile.name;
      if (profile.avatar && !user.avatar) update.avatar = profile.avatar;

      if (Object.keys(update).length) {
        Object.assign(user, update);
        await user.save();
      }

    } else {
      // Create new user
      user = await User.create({
        name: profile.name || "User",
        email: profile.email,
        password: Math.random().toString(36).slice(-8), // random password (never used)
        isVerified: profile.email_verified || false,
        googleId: provider === "google" ? profile.id : undefined,
        facebookId: provider === "facebook" ? profile.id : undefined,
        appleId: provider === "apple" ? profile.id : undefined,
        avatar: profile.avatar || undefined,
      });
    }

    const tokens = await generateTokenForUser(user, { ip, userAgent });
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }
}

export default new SocialAuthService();