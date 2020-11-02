module.exports = (sequelize, Sequelize) => {
    class Product extends Sequelize.Model { }
    Product.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        title: Sequelize.STRING
    }, { sequelize });
    return Product;
}