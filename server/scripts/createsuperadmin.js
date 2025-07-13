// scripts/createSuperadmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://bayfiras:bayfiras150302@carpart.c1hq0el.mongodb.net/';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    const email = 'bayfiras@nmtc.tn';
    const password = 'supersecret123';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Superadmin user already exists');
      process.exit(0);
    }

    const user = new User({
      name: 'Super Admin',
      email,
      password, // <-- plain text here, hashing happens in pre-save
      role: 'superadmin'
    });

    await user.save();  // triggers password hashing hook

    console.log('Superadmin user created successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
