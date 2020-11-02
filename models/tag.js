module.exports = (sequelize, Sequelize) => {
    class Tag extends Sequelize.Model {}
    Tag.init({
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING
    }, { sequelize });
    return Tag;
}