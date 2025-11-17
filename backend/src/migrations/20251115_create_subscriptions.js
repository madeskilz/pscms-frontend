exports.up = function(knex) {
  return knex.schema.createTable('subscriptions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().nullable();
    table.string('plan').notNullable().defaultTo('unknown');
    table.integer('amount_cents').unsigned().nullable();
    table.string('currency', 8).nullable();
    table.string('status', 32).nullable();
    table.timestamp('started_at').nullable();
    table.timestamp('renewed_at').nullable();
    table.json('raw_data').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscriptions');
};
