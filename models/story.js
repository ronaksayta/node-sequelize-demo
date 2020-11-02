module.exports = (sequelize, Sequelize) => {
    class Story extends Sequelize.Model { }
    Story.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        name: Sequelize.STRING,
        teamSize: Sequelize.INTEGER
    }, { sequelize });
    return Story;
}