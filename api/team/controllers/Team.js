'use strict';

const { sanitizeEntity } = require('strapi-utils')

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByCode (ctx) {
    const id = strapi.hashids.decode(ctx.params.code)[0]
    const entity = await strapi.services.team.findOne({ id: id || 0 });
    return sanitizeEntity(entity, { model: strapi.models.team });
  }
}
