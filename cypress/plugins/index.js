/// <reference types="cypress" />
import axios from 'axios';

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = on => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    async 'db:seed'() {
      const { data } = await axios({
        url: `https://api.dev.reimburse.digital/api/v1/cypress/seed-db/`,
        method: 'post',
        headers: { 'X-dts-schema': 'tesla' },
      });
      // console.log('DB seed response: ', data);
      return data;
    },
  });
};
