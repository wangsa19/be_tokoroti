const sequelize = require('../config/database');

const db = {};

db.Sequelize = require('sequelize');
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize);
db.Product = require('./product')(sequelize);
db.Order = require('./order')(sequelize);
db.OrderItem = require('./orderItem')(sequelize);

// Define relationships
// User -> Order (One-to-Many)
db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

// Order -> OrderItem (One-to-Many)
db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

// Product -> OrderItem (One-to-Many)
db.Product.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Product, {
  foreignKey: 'ProductId',
  onDelete: 'RESTRICT'
});

module.exports = db;