const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "o8hv5v",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  
    env: {
      OrangeHRM: "https://opensource-demo.orangehrmlive.com",
    },
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
    reporter:"mochawesome",
    reporterOptions: {
      reportDir: "cypress/mochawesome-report",
      overwrite: false,
      html: false,
      json: true,
      charts: true,
      reportPageTitle: "custom-title",
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    }

});
