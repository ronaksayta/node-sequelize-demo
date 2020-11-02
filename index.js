const Sequelize = require('sequelize');
var ProductModel = require('./models/product');
var TagModel = require('./models/tag');
var StoryModel = require('./models/story');

const sequelize = new Sequelize('sequelize_demo', 'root', 'root123', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}, {
    define: { raw: true }
  });

sequelize.authenticate().then(() => {
  console.log('Connection successful !');
}).catch((error) => {
  console.log('Error in connection: ', error);
});

var Story = StoryModel(sequelize, Sequelize);
var Product = ProductModel(sequelize, Sequelize);
var Tag = TagModel(sequelize, Sequelize);

Story.belongsTo(Product, { foreignKey: 'productId' })

const StoryTag = sequelize.define('story_tag', {});
Story.belongsToMany(Tag, { through: StoryTag, unique: false, as: 'Tags' });
Tag.belongsToMany(Story, { through: StoryTag, unique: false, as: 'Stories' });

sequelize.sync({ alter: true }).then(() => {
  console.log('Tables created!');
}).then(() => {
  var story = {
    name: "New Story",
    teamSize: 5,
    product: {
      title: "Product title 15"
    },
    tags: [
      { name: "Tag 3" },
      { name: "Tag 5" }
    ]
  }
  addStory(story);
});

function addStory(story) {
  var product = story.product;
  var productToAdd;
  var addProducts = addProduct(product).then(data => {
    productToAdd = data;
  });
  var tags = story.tags;
  var tagsToAdd;
  var addTags = addTag(tags).then(data => {
    tagsToAdd = data
  });
  Promise.all([addProducts, addTags]).then(() => {
    story.productId = productToAdd;
    delete story['product'];
    delete story['tags'];
    Story.create(story).then((story) => {
      story.setTags(tagsToAdd);
    })
  });
}

function addProduct(product) {
  return new Promise((resolve, reject) => { 
    Product.findOrCreate({ where: { title: product.title }, defaults: { title: product.title } }).then((data) =>
      {
        resolve(JSON.parse(JSON.stringify(data))[0].id);
    }).catch((error) => {
      reject(error);
    });
  })
}

function addTag(tags) {
  promiseTags = [];
  return new Promise((resolve, reject) => {
    const promises = tags.map(function (tag) {
      return Tag.findOrCreate({ where: { name: tag.name}, defaults: { name: tag.name}}).then(function (tag) {
        return promiseTags.push(JSON.parse(JSON.stringify(tag))[0].id);
      })
    });
    Promise.all(promises).then(() => {
      resolve(promiseTags);
    }).catch((error) => {
      reject(error);
    })
  })
}
