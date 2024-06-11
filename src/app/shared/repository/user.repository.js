/* eslint-disable no-unused-vars */
const BaseRepository = require('./base/MysqlBaseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('mysql', 'User');
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findUserOrders(userId) {
    const id = Number(userId);
    const joins = [
      {
        table: '`Order`',
        on: 'User.id = Order.userId',
      },
      {
        table: '`OrderDetail`',
        on: 'Order.id = OrderDetail.orderId',
      },
    ];

    const fields = {
      'User.id': 'userId',
      'User.name': 'userName',
      'Order.id': 'orderId',
      'Order.order': 'orderCode',
      'OrderDetail.productCode': 'productCode',
      'OrderDetail.quantity': 'quantity',
    };

    const orders = await this.findWithJoin(joins, {}, fields, {});

    return orders;
  }
}

module.exports = new UserRepository();
