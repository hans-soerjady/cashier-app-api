'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.hasMany(models.transactionDetails)
      transactions.belongsTo(models.accounts, {foreignKey: "id"})
    }
  }
  transactions.init({
    custEmail: DataTypes.STRING,
    cashierId: DataTypes.INTEGER,
    totalAmount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transactions',
    paranoid: true
  });
  return transactions;
};