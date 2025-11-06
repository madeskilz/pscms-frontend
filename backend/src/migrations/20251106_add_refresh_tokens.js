exports.up = async function(knex) {
  await knex.schema.createTable('refresh_tokens', t => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('token_hash').notNullable().unique();
    t.timestamp('expires_at').notNullable();
    t.timestamp('revoked_at');
    t.string('replaced_by_token_hash');
    t.string('ip');
    t.string('user_agent');
    t.timestamps(true,true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
};
