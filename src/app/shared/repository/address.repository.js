const BaseRepository = require('./base/MysqlBaseRepository');

class AddressRepository extends BaseRepository {
  constructor() {
    super('mysql', 'Address');
  }
}

module.exports = new AddressRepository();
