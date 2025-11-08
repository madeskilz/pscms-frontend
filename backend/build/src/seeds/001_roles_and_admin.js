const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Clear tables (order matters for foreign keys)
  await knex('users').del().catch(()=>{});
  await knex('roles').del().catch(()=>{});

  const capabilities = [
    'manage_users','manage_plugins','create_post','publish_post','upload_media','view_analytics','impersonate','manage_settings'
  ];

  await knex('roles').insert({
    name: 'Administrator',
    capabilities: JSON.stringify(capabilities)
  });

  const role = await knex('roles').where({ name: 'Administrator' }).first();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  const passwordHash = await bcrypt.hash('ChangeMe123!', saltRounds);

  await knex('users').insert({
    email: 'admin@school.test',
    password_hash: passwordHash,
    display_name: 'Admin User',
    role_id: role.id,
    active: true
  });

  // Helpful console output when run locally
  // eslint-disable-next-line no-console
  console.log('Seeded Administrator role and admin user (admin@school.test / ChangeMe123!)');
};
