/* eslint-disable @typescript-eslint/no-require-imports */
const { v4: uuid } = require('uuid');
require('dotenv').config();

module.exports = {
  async up(db) {
    const role = await db.collection('roles').findOne({ name: 'admin' });
    if (!role) throw new Error('Role not found');

    const roles = [
      {
        _id: uuid(),
        name: process.env.ADMIN_NAME,
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.PASSWORD_HASH,
        role: role._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    await db.collection('users').insertMany(roles);
    console.log('Users added successfully');
  },

  async down(db) {
    const userEmail = ['dev.danielsantiago@gmail.com'];

    await db.collection('users').deleteMany({ email: { $in: userEmail } });
    console.log('Users removed successfully');
  },
};
