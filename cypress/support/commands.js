import { faker } from '@faker-js/faker'
import { randomizeViewport } from "./helper";

const hireName = faker.person.fullName()
const candidateName = faker.person.fullName();
const text = faker.lorem.sentence()
const keyword = faker.food.vegetable()

Cypress.Commands.add("setViewport", () => {
    let size = randomizeViewport();
    if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
    } else {
        cy.viewport(size);
    }
});

Cypress.Commands.add('menuValidation', () => {
    cy.get('.oxd-sidepanel-body').within(() => {
        cy.get('.oxd-main-menu-item-wrapper').should('have.length', 12)
        cy.wrap([
            [/Admin/i, "/web/index.php/admin/viewAdminModule"],
            [/PIM/i, "/web/index.php/pim/viewPimModule"],
            [/Leave/i, "/web/index.php/leave/viewLeaveModule"],
            [/Time/i, "/web/index.php/time/viewTimeModule"],
            [/Recruitment/i, "/web/index.php/recruitment/viewRecruitmentModule"],
            [/My Info/i, "/web/index.php/pim/viewMyDetails"],
            [/Performance/i, "/web/index.php/performance/viewPerformanceModule"],
            [/Dashboard/i, "/web/index.php/dashboard/index"],
            [/Directory/i, "/web/index.php/directory/viewDirectory"],
            [/Maintenance/i, "/web/index.php/maintenance/viewMaintenanceModule"],
            [/Claim/i, "/web/index.php/claim/viewClaimModule"],
            [/Buzz/i, "/web/index.php/buzz/viewBuzz"],
        ]).as('menuItems')
    })
})

Cypress.Commands.add('invalidLogin', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get('input[name="username"]').type('3434')
    cy.get('input[name="password"]').type('3434')
    cy.saveButton().click()
})

Cypress.Commands.add('loginOrange', () => {
    cy.session('Kendall', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get('input[name="username"]').type('Admin', { log: false })
        cy.get('input[name="password"]').type('admin123', { log: false })
        cy.saveButton().click()

    })
})

Cypress.Commands.add('hiringEmployeeNegative', () => {
    cy.activeInput().eq(4).clear()
    cy.saveButton().click()
})

Cypress.Commands.add('hiringEmployee', () => {
    cy.get('input[type="file"]').selectFile('cypress/images/imatest.jpg', { force: true })
    cy.get('input[name="firstName"]').type(hireName)
    cy.get('input[name="lastName"]').type('Harrell')
    cy.activeInput()
        .eq(3).clear()
        .type('7777')
})

Cypress.Commands.add('adminUser', () => {
    const randomPassword = faker.internet.password({ length: 20 })
    const randomUsername = faker.internet.userName()

    cy.get('.oxd-select-text--after').eq(0)
        .click()
    cy.contains('ESS').click()

    cy.get('.oxd-select-text--after').eq(1)
        .click()
    cy.contains('Enabled').click()

    cy.get('input[type="password"]').eq(0).type(randomPassword, { log: false })
    cy.get('input[type="password"]').eq(1).type(randomPassword, { log: false })
    cy.get('input[placeholder="Type for hints..."]').type(hireName)
    cy.contains(hireName).click()
    cy.activeInput().eq(1).type(randomUsername, { log: false })
    cy.saveButton().click()
})

Cypress.Commands.add('formFilling', () => {
    const randEmail = faker.internet.email()

    cy.get('input[name="firstName"]').type(candidateName)
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[placeholder="Type here"]').eq(0).type(randEmail)
    cy.get('input[placeholder="Type here"]').eq(1).type('+506 88888888')
    cy.get('input[type="file"]').selectFile('cypress/images/test.pdf', { force: true })
    cy.get('input[placeholder="Enter comma seperated words..."]').type(keyword)
    cy.get('.oxd-textarea--resize-vertical').type('Nothing to add here')
    cy.get('.oxd-checkbox-input-icon').click({ force: true })
    cy.saveButton().click()
})

Cypress.Commands.add('addingVacancy', () => {
    cy.activeInput().eq(1).type('SDET')
    cy.get('.oxd-select-text--after').click()
    cy.contains('QA Engineer').click()
    cy.get('.oxd-textarea').type('SDET Job Position Test')
    cy.get('input[placeholder="Type for hints..."]').type(hireName)
    cy.contains(hireName).click()
    cy.activeInput().eq(2).type('27')
    cy.get('.orangehrm-vacancy-link').eq(1).invoke('text').then(text => {
        cy.log(text); // Print the text content
    });
    cy.saveButton().click()
})

Cypress.Commands.add('vacancyApplyFail', () => {

    cy.get('.orangehrm-vacancy-card-header').filter(':contains("SDET")').within(() => {
        // Validating SDET position is visible on the apply page
        cy.saveButtonType().click()
    })
    cy.saveButton().click()
})

Cypress.Commands.add('vacancyApply', () => {
    cy.get('.orangehrm-vacancy-card-header').filter(':contains("SDET")').within(() => {
        // Validating SDET position is visible on the apply page
        cy.saveButtonType().click()
    })
    cy.formFilling()
    cy.get('.orangehrm-text-center-align').should('have.text', 'Your application has been submitted successfully')
})

Cypress.Commands.add('shortlist', () => {
    cy.get('.oxd-select-text-input').eq(1).click()
    cy.get('div[role="listbox"]').contains('SDET').click()
    cy.saveButton().click()

    cy.get('.oxd-padding-cell').eq(9).should('include.text', candidateName)
    cy.saveButtonType().eq(5).click()
    cy.get('.oxd-text--p').eq(0).should('include.text', candidateName)
    cy.saveButtonType().eq(4).click()
    cy.get('.oxd-textarea--resize-vertical').type('Shortlisting application')
    cy.saveButton().click()
    cy.log("shortlisting saved")
})

Cypress.Commands.add('interviewSchedule', () => {
    cy.get('.oxd-text--subtitle-2').should('include.text', 'Status: Shortlisted')
    cy.saveButtonType().eq(4).click()

    cy.activeInput().eq(5).type('Cypress Test Interview')
    cy.get('button[type="submit"]').type(`Interview of ${candidateName}`)
    cy.get('input[placeholder="Type for hints..."]').type(hireName)
    cy.contains(hireName).click()

    cy.activeInput().eq(6).click()
    cy.get('.bi-chevron-right').click()
    cy.get('.oxd-calendar-dates-grid').contains('1').click()
    cy.get('.oxd-time-input--clock').click()
    cy.get('.oxd-textarea--resize-vertical').type('Interview appointment for SDET')
    cy.saveButton().click()
    cy.log("interview scheduled")
})

Cypress.Commands.add('interviewPassed', () => {
    cy.saveButtonType().eq(5).click()
    cy.get('.oxd-textarea--resize-vertical').type('Interview passed successfully')
    cy.saveButton().click()
    cy.get('.oxd-text--p').eq(0).should('include.text', candidateName)

    cy.get('.oxd-text--subtitle-2').should('contain', 'Interview Passed')
    cy.log("interview passed")
})

Cypress.Commands.add('jobOffer', () => {
    cy.saveButtonType().eq(5).click()
    cy.get('.oxd-textarea--resize-vertical').type('Job offer for the SDET position') /
        cy.saveButton().click()
    cy.log("job offered")
})


Cypress.Commands.add('verificationHire', () => {
    cy.get('.oxd-text--subtitle-2').should('contain', 'Job Offered')
    cy.saveButtonType().eq(5).click()
    cy.get('.oxd-textarea--resize-vertical').type('Hired for SDET position')
    cy.saveButton().click()

    cy.get('.oxd-text--subtitle-2')
        .should('contain', 'Hired')
    cy.log("candidate hired")
})

Cypress.Commands.add('deleteVacancy', () => {
    cy.get('.oxd-select-text--after').eq(1).click()
    cy.get('.oxd-select-dropdown').contains('SDET').click()
    cy.saveButton().click()

    cy.get('.oxd-table-row--with-border').filter(':contains("SDET")').within(() => {
        cy.trashButton().click()
    })
    cy.deleteConfirm().click()
})


Cypress.Commands.add('deleteHiringInfo', () => {
    cy.activeInput().eq(1).type('7777')
    cy.searchButton().click()
    cy.get('.oxd-padding-cell').eq(10).should('have.text', '7777')
    cy.trashButton().click()
    cy.deleteConfirm().click()
})


Cypress.Commands.add('deleteCandidate', () => {
    cy.get('input[placeholder="Enter comma seperated words..."]').type(keyword)   
    cy.searchButton().click()
    cy.get('div[role="cell"]').eq(2).should('include.text', candidateName)
    cy.trashButton().eq(0).click()
    cy.deleteConfirm().click()
})

Cypress.Commands.add('applyLeave', () => {
    cy.get('.oxd-select-text--after').click()
    cy.contains('CAN').click()

    cy.get('.oxd-date-input-icon').eq(0).click()
    cy.get('.bi-chevron-right').click()
    cy.get('.oxd-calendar-dates-grid').contains('11').click()

    cy.get('.oxd-date-input-icon').eq(1).click()
    cy.get('.oxd-calendar-dates-grid').eq(1).contains('11').click()

    cy.get('.oxd-select-text--after').eq(1).click()
    cy.contains('Half Day - Morning').click()

    cy.get('.oxd-textarea').type(text)
    cy.saveButton().click()
})

Cypress.Commands.add('deleteLeave', () => {
    cy.contains('div', 'Pending Approval (0.50)') 
    .parents('.oxd-table-row') 
    .find('button:contains("Cancel")')
    .click()
})

Cypress.Commands.add('postBuzz', () => {
    cy.get('.oxd-buzz-post-input').type(keyword)
    cy.saveButton().click()
})

Cypress.Commands.add('deleteBuzz', () => {
    cy.get('.orangehrm-buzz-post-body-text').eq(0).should('have.text', keyword)
    cy.saveButtonType().eq(8).click()
    cy.contains('Delete Post').click()
    cy.deleteConfirm().click()

})

Cypress.Commands.add('uploadFileFail', () => {
    cy.get('.oxd-button-icon').click()
    cy.saveButton().eq(2).click()

})

Cypress.Commands.add('uploadFile', () => {
    cy.get('input[type="file"]').selectFile('cypress/images/imatest.jpg', { force: true })
    cy.get('textarea[placeholder="Type comment here"]').type('Test image posted')
    cy.saveButton().eq(2).click()
})

// LOCATOR SECTION

Cypress.Commands.add('saveButton', () => {
    cy.get('button[type="submit"]')
})

Cypress.Commands.add('saveButtonType', () => {
    cy.get('button[type="button"]')
})
Cypress.Commands.add('searchButton', () => {
    cy.contains('Search')
})

Cypress.Commands.add('trashButton', () => {
    cy.get('.bi-trash')
})

Cypress.Commands.add('deleteConfirm', () => {
    cy.contains('Yes, Delete')
})

Cypress.Commands.add('activeInput', () => {
    cy.get('.oxd-input--active')
})

Cypress.Commands.add('errorMessage', () => {
    cy.get('.oxd-input-group__message')
})