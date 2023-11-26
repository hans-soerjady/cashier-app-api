'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactionDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactionDetails.belongsTo(models.transactions)
    }
  }
  transactionDetails.init({
    transactionId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    subTotal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transactionDetails',
    paranoid: true
  });
  return transactionDetails;
};