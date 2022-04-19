'use strict';

const { info, error, warn, debug } = require('heroku-logger')
const HashIDs = require('hashids/cjs')
const hashids = new HashIDs('', 6, 'abcdefghijklmnopqrstuvwxyz1234567890')

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/configurations/configurations.html#bootstrap
 */

module.exports = async () => {
    // Global strapi attachments
    strapi.hashids = hashids

    const { admin, agency, team } = strapi.config.initialData
    const dbAdmins = await strapi.admin.models.administrator.count()
    const agencies = await strapi.models.agency.count()

    // Initial Database Admin Account
    if (dbAdmins === 0) {
        info('Setting up admin account.')

        await strapi.admin.models.administrator.forge({
            email: admin.email,
            username: admin.username,
            password: await strapi.admin.services.auth.hashPassword(admin.password)
        }).save()

        info('Admin account created.', strapi.config.initialData.admin)
    }

    // Initial Agency and Team
    if (agencies === 0) {
        info('Creating initial agency.')

        const newAgency = await strapi.models.agency.forge(agency).save()
        await strapi.models.team.forge({
            agency: newAgency.id,
            ...team
        }).save()

        info('Created initial agency and team.', {
            agency: agency.name,
            agencyAddress: agency.address,
            team: team.name
        })
    }

    /**
     * TODO:
     * 1. Create initial roles if it doesnt yet exist.
     * 1. Create an initial system admin account if it doesnt yet exist.
     */
};
