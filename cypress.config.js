const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "o8hv5v",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  
    env: {
      OrangeHRM: "https://opensource-demo.orangehrmlive.com",
      AddEmployee: "https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee",
      SaveSystemUser: "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      AddCandidate: "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate",
      CheckJobPosition: "https://opensource-demo.orangehrmlive.com/web/index.php/recruitmentApply/jobs.html",
      CandidatePage: "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates",
      JobVacancy: "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addJobVacancy",
      PostPage: "https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz",
      ownerPage: "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7",

      demoqa: "https://demoqa.com",
      reqres : "https://reqres.in",
      cypressweb: "https://docs.cypress.io",
    },
  
  },
    reporter:"mochawesome",
    reporterOptions: {
      reportDir: "cypress/mochawesome-report",
      overwrite: false,
      html: false,
      json: true,
    }

});
