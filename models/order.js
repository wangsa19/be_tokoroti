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
    deliveryAddress: {
      type: DataTypes.STRING
    },
    deliveryLatitude: {
      type: DataTypes.DOUBLE
    },
    deliveryLongitude: {
      type: DataTypes.DOUBLE
    },
    status: {
      type: DataTypes.ENUM('unpaid', 'paid', 'expired', 'failed', 'delivered'),
      defaultValue: 'unpaid'
    },
    snapUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionId: { 
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Order;
};