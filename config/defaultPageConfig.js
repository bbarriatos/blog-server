const path = require('path');

const defaultPageConfig = {
  title: 'Login | Bon Blog Site',
  listExists: true,
};

module.exports = {
  defaultPageConfig,
  uploadDir: path.join(__dirname, '../public/uploads/'),
};
