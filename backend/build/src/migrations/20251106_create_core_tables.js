exports.up = async function(knex) {
  await knex.schema.createTable('roles', t=>{
    t.increments('id').primary();
    t.string('name').notNullable().unique();
    t.text('capabilities');
    t.timestamps(true,true);
  });

  await knex.schema.createTable('users', t=>{
    t.increments('id').primary();
    t.string('email').notNullable().unique();
    t.string('password_hash');
    t.string('display_name');
    t.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL');
    t.boolean('active').defaultTo(true);
    t.timestamps(true,true);
  });

  await knex.schema.createTable('posts', t=>{
    t.increments('id').primary();
    t.string('type').notNullable().defaultTo('post');
    t.string('status').notNullable().defaultTo('draft');
    t.string('title');
    t.text('content');
    t.string('slug').notNullable().unique();
    t.integer('author_id').unsigned().references('id').inTable('users');
    t.json('meta');
    t.timestamps(true,true);
  });

  await knex.schema.createTable('taxonomies', t=>{
    t.increments('id').primary();
    t.string('taxonomy');
    t.string('name');
    t.string('slug');
    t.json('meta');
  });

  await knex.schema.createTable('post_taxonomy', t=>{
    t.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    t.integer('taxonomy_id').unsigned().references('id').inTable('taxonomies').onDelete('CASCADE');
    t.primary(['post_id','taxonomy_id']);
  });

  await knex.schema.createTable('media', t=>{
    t.increments('id').primary();
    t.string('filename');
    t.string('path');
    t.string('mime');
    t.integer('size');
    t.integer('uploader_id').unsigned().references('id').inTable('users');
    t.json('meta');
    t.timestamps(true,true);
  });

  await knex.schema.createTable('menus', t=>{
    t.increments('id').primary();
    t.string('name');
    t.json('items');
  });

  await knex.schema.createTable('comments', t=>{
    t.increments('id').primary();
    t.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    t.integer('author_id').unsigned().references('id').inTable('users');
    t.text('content');
    t.string('status').defaultTo('pending');
    t.timestamps(true,true);
  });

  await knex.schema.createTable('settings', t=>{
    t.string('key').primary();
    t.json('value');
  });

  await knex.schema.createTable('analytics_events', t=>{
    t.increments('id').primary();
    t.string('event_type');
    t.integer('entity_id');
    t.json('payload');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex){
  await knex.schema.dropTableIfExists('analytics_events');
  await knex.schema.dropTableIfExists('settings');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('menus');
  await knex.schema.dropTableIfExists('media');
  await knex.schema.dropTableIfExists('post_taxonomy');
  await knex.schema.dropTableIfExists('taxonomies');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
};
