'use strict';

const { createReadStream } = require('fs')
const { join } = require('path')

module.exports = async ctx => {
    const { request } = ctx

    if (request.method === 'GET' && request.header.accept.search('text/html') >= 0) {
        ctx.status = 200
        ctx.type = 'html'
        ctx.body = createReadStream(join(__dirname, '../../../public/index.html'))
    }
}
