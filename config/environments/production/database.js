const { ConnectionString } = require('connection-string')
const connection = new ConnectionString(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/mi_salud')

module.exports = {
  "defaultConnection": "default",
  "connections": {
    "default": {
      "connector": "strapi-hook-bookshelf",
      "settings": {
        "client": connection.protocol,
        "host": connection.hosts[0].name,
        "port": connection.hosts[0].port,
        "database": connection.path[0],
        "username": connection.user,
        "password": connection.password
      },
      "options": {}
    }
  }
}
