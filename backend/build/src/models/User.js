const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        password_hash: { type: ['string', 'null'] },
        display_name: { type: ['string', 'null'] },
        role_id: { type: ['integer', 'null'] },
        active: { type: 'boolean' }
      }
    };
  }
}

module.exports = User;
