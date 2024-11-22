/* eslint-disable @typescript-eslint/no-require-imports */
const { v4: uuid } = require('uuid');

module.exports = {
  async up(db) {
    const permissions = [
      {
        _id: uuid(),
        name: 'user:list',
        description: 'List users',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'user:self',
        description: 'Self modifications',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'permission:create',
        description: 'Create permission',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'permission:update',
        description: 'Update permission',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'permission:delete',
        description: 'Delete permission',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'permission:list',
        description: 'List permission',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'role:list',
        description: 'List roles',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'role:create',
        description: 'Create role',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'role:update',
        description: 'Update role',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'role:delete',
        description: 'Delete role',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'role:add',
        description: 'Add one role',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        _id: uuid(),
        name: 'role:remove',
        description: 'Remove one role',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    await db.collection('permissions').insertMany(permissions);
    console.log('Permissions added successfully');
  },

  async down(db) {
    const permissionNames = [
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
    ];

    await db
      .collection('permissions')
      .deleteMany({ name: { $in: permissionNames } });
    console.log('Permissions removed successfully');
  },
};
