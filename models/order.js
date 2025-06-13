const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'delivered'),
      defaultValue: 'pending'
    },
    deliveryAddress: {
      type: DataTypes.STRING
    },
    deliveryLatitude: {
      type: DataTypes.DOUBLE
    },
    deliveryLongitude: {
      type: DataTypes.DOUBLE
    }
  });

  return Order;
};