import { faker } from '@faker-js/faker'
import { randomizeViewport } from "./helper";

const hireName = faker.person.fullName()
const candidateName = faker.person.fullName({firstName: 'Trezeguet'});
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

// Assertion of menu options in the left side panel
Cypress.Commands.add('menuValidation', () => {
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

// Invalid Login Scenario: Submitting invalid username and password
Cypress.Commands.add('invalidLogin', () => {
    cy.get('input[name="username"]').type('3434')
    cy.get('input[name="password"]').type('3434')
    cy.saveButton().click()
})

// Logging in, positive Scenario
Cypress.Commands.add('loginOrange', () => {
    cy.session('Kendall', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get('input[name="username"]').type('Admin', { log: false })
        cy.get('input[name="password"]').type('admin123', { log: false })
        cy.saveButton().click()

    })
})

// Negative Hiring Employee Scenario: Saving form without any information being filled out
Cypress.Commands.add('hiringEmployeeNegative', () => {
    cy.activeInput().eq(4).clear()
    cy.saveButton().click()
})

// Positive Hiring Employee Scenario
Cypress.Commands.add('hiringEmployee', () => {
    cy.get('input[type="file"]').selectFile('cypress/images/imatest.jpg', { force: true })
    cy.get('input[name="firstName"]').type(hireName)
    cy.get('input[name="lastName"]').type('Harrell')
    cy.activeInput()
        .eq(3).clear()
        .type('7777')
})

// Adding user as an Admin
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

// Filling the form to add a candidate to the list
Cypress.Commands.add('formFilling', () => {
    const randEmail = faker.internet.email()

    cy.get('input[name="firstName"]').type(candidateName)
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[placeholder="Type here"]').eq(0).type(randEmail)
    cy.get('input[placeholder="Type here"]').eq(1).type('+506 88888888')
    cy.get('input[type="file"]').selectFile('cypress/images/test.pdf', { force: true })
    cy.get('input[placeholder="Enter comma seperated words..."]').type(keyword)
    cy.notesField().type('Nothing to add here')
    cy.get('.oxd-checkbox-input-icon').click({ force: true })
    cy.saveButton().click()
})

// Flow to add a Vacancy for SDET
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

// Negative Vacancy application Employee Scenario: Saving form without any information being filled out
Cypress.Commands.add('vacancyApplyFail', () => {

    cy.get('.orangehrm-vacancy-card-header').filter(':contains("SDET")').within(() => {
        // Validating SDET position is visible on the apply page
        cy.saveButtonType().click()
    })
    cy.saveButton().click()
})

// Positive Vacancy application Employee Scenario
Cypress.Commands.add('vacancyApply', () => {
    cy.get('.orangehrm-vacancy-card-header').filter(':contains("SDET")').within(() => {
        // Validating SDET position is visible on the apply page
        cy.saveButtonType().click()
    })
    cy.formFilling()
})

// Shortlisting the candidate
Cypress.Commands.add('shortlist', () => {
    cy.contains('.oxd-padding-cell', candidateName) 
    .closest('.oxd-table-row') 
    .find('button i.bi-eye-fill').click()
    cy.saveButtonType().eq(4).click()
    cy.notesField().type('Shortlisting application')
    cy.saveButton().click()
    cy.log("shortlisting saved")
})

// After shortlisting, adding the candidate for an interview appointment
Cypress.Commands.add('interviewSchedule', () => {
    cy.saveButtonType().eq(4).click()

    cy.activeInput().eq(5).type('Cypress Test Interview')
    cy.get('button[type="submit"]').type(`Interview of ${candidateName}`)
    cy.get('input[placeholder="Type for hints..."]').type(hireName)
    cy.contains(hireName).click()

    cy.activeInput().eq(6).click()
    cy.get('.bi-chevron-right').click()
    cy.get('.oxd-calendar-dates-grid').contains('1').click()
    cy.get('.oxd-time-input--clock').click()
    cy.notesField().type('Interview appointment for SDET')
    cy.saveButton().click()
    cy.log("interview scheduled")
})

// Flow to accept the candidate after passing the interview
Cypress.Commands.add('interviewPassed', () => {
    cy.saveButtonType().eq(5).click()
    cy.notesField().type('Interview passed successfully')
    cy.saveButton().click()
    cy.log("interview passed")
})

// Offering a job
Cypress.Commands.add('jobOffer', () => {
    cy.saveButtonType().eq(5).click()
    cy.notesField().type('Job offer for the SDET position') /
    cy.saveButton().click()
    cy.log("job offered")
})

// Confirming candidate as hired
Cypress.Commands.add('verificationHire', () => {
    cy.saveButtonType().eq(5).click()
    cy.notesField().type('Hired for SDET position')
    cy.saveButton().click()
    cy.log("candidate hired")
})

// Deleting the vacancy added for SDET
Cypress.Commands.add('deleteVacancy', () => {
    cy.get('.oxd-select-text--after').eq(1).click()
    cy.get('.oxd-select-dropdown').contains('SDET').click()
    cy.saveButton().click()

    cy.get('.oxd-table-row--with-border').filter(':contains("SDET")').within(() => {
        cy.trashButton().click()
    })
    cy.deleteConfirm().click()
})

// Deleting hiring information/user
Cypress.Commands.add('deleteHiringInfo', () => {
    cy.activeInput().eq(1).type('7777')
    cy.searchButton().click()
    cy.get('.oxd-padding-cell')
    .filter(':contains("7777")')
    .parent().find('.bi-trash').click()
    cy.deleteConfirm().click()
})

// Deleting Candidate information/user
Cypress.Commands.add('deleteCandidate', () => {
    cy.get('input[placeholder="Enter comma seperated words..."]').type(keyword)   
    cy.searchButton().click()
    cy.get('div[role="cell"]')
    .contains('Trezeguet')
    .parents('.oxd-table-card').find('.bi-trash').click()
    cy.deleteConfirm().click()
})

// Applying for a leave
Cypress.Commands.add('applyLeave', () => {
    cy.get('.oxd-select-text--after').click()
    cy.contains('CAN').click()

    cy.get('.oxd-date-input-icon').eq(0).click()
    cy.get('.bi-chevron-right').click()
    cy.get('.oxd-calendar-dates-grid').contains('13').click()

    cy.get('.oxd-date-input-icon').eq(1).click()
    cy.get('.oxd-calendar-dates-grid').eq(1).contains('13').click()

    cy.get('.oxd-select-text--after').eq(1).click()
    cy.contains('Half Day - Morning').click()

    cy.get('.oxd-textarea').type(text)
    cy.saveButton().click()
})

// Deleting leave application
Cypress.Commands.add('deleteLeave', () => {
    cy.contains('div', 'Pending Approval (0.50)') 
    .parents('.oxd-table-row') 
    .find('button:contains("Cancel")')
    .click()
})

// Posting a note in the feed section
Cypress.Commands.add('postBuzz', () => {
    cy.wait(2000)
    cy.get('.oxd-buzz-post-input').type(keyword)
    cy.saveButton().click()
})

// Deleting the post note
Cypress.Commands.add('deleteBuzz', () => {
    cy.saveButtonType().eq(8).click()
    cy.contains('Delete Post').click()
    cy.deleteConfirm().click()
})


// Trying to submit a file without attachments 
Cypress.Commands.add('uploadFileFail', () => {
    cy.get('.oxd-button-icon').click()
    cy.saveButton().eq(2).click()

})

// Uploading a file flow
Cypress.Commands.add('uploadFile', () => {
    cy.get('.oxd-button-icon').click()
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

Cypress.Commands.add('candidateStatus', () => {
    cy.get('.oxd-text--subtitle-2', {timeout: 7000})
})

Cypress.Commands.add('notesField', () => {
    cy.get('.oxd-textarea--resize-vertical')
})