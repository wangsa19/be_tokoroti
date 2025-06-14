const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Cart hanya berfungsi sebagai kontainer untuk CartItems
  // dan terhubung langsung dengan satu User.
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
    // UserId akan ditambahkan secara otomatis melalui asosiasi
  });

  return Cart;
};