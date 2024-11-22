/* eslint-disable @typescript-eslint/no-require-imports */
const { v4: uuid } = require('uuid');

module.exports = {
  async up(db) {
    const user_permissions = (
      await db
        .collection('permissions')
        .find({
          name: { $in: ['user:self'] },
        })
        .toArray()
    ).map((permission) => permission._id);

    if (user_permissions.length !== 1)
      throw new Error('User permission not found');

    const admin_permissions = (
      await db
        .collection('permissions')
        .find({
          name: {
            $in: [
              'user:list',
              'user:self',
              'permission:create',
              'permission:update',
              'permission:delete',
              'permission:list',
              'role:list',
              'role:create',
              'role:update',
              'role:delete',
              'role:add',
              'role:remove',
            ],
          },
        })
        .toArray()
    ).map((permission) => permission._id);

    if (admin_permissions.length !== 12)
      throw new Error('Admin permissions not found');

    const roles = [
      {
        _id: uuid(),
        name: 'user',
        permissions: user_permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'admin',
        permissions: admin_permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    await db.collection('roles').insertMany(roles);
    console.log('Roles added successfully');
  },

  async down(db) {
    const roleNames = ['user', 'admin'];

    await db.collection('roles').deleteMany({ name: { $in: roleNames } });
    console.log('Roles removed successfully');
  },
};
