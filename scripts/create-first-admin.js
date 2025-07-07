const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Admin Schema (same as in your model)
const adminSchema = new mongoose.Schema({
  admin_name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: 'admin',
    required: [true, 'Role is required'],
  },
  profileImage: {
    type: String,
  },
  permissions: [{
    type: String,
    default: [],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

async function createFirstAdmin() {
  try {
    // Connect to MongoDB (replace with your connection string)
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bitnbolt_in';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'bitnbolt2025@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    // Admin details (change these as needed)
    const adminData = {
      admin_name: 'Super Admin',
      email: 'bitnbolt2025@gmail.com',
      password: 'admin123', // This will be hashed
      role: 'super_admin',
      permissions: ['all'],
      isActive: true
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Create admin
    const admin = new Admin({
      ...adminData,
      password: hashedPassword
    });

    await admin.save();
    console.log('✅ First admin created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Role:', adminData.role);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createFirstAdmin(); 