// Example Mongoose Model
// Import this in your backend/API routes

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ status: 1, createdAt: -1 });

// Virtual fields
userSchema.virtual('displayName').get(function () {
  return this.name || this.email;
});

// Methods
userSchema.methods.isActive = function () {
  return this.status === 'active';
};

// Static methods
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Export model
export const User =
  mongoose.models.User || mongoose.model('User', userSchema);

export default User;
