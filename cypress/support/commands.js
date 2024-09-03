const candidateName = 'John David Doe';
const hireName = 'Mitchell Harrell'

// command for random character creation
Cypress.Commands.add('randomStringcreation', () => {
    function generateRandomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }

        return randomString;
    }

    // Usage example:
    const randomString = generateRandomString(7);
    cy.get('.oxd-input--active').eq(1).type(randomString, { log: false })
})

Cypress.Commands.add('randomPassword', () => {
    function generateRandomPassword() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        let password = '';

        for (let i = 0; i < 4; i++) {
            const letter = letters.charAt(Math.floor(Math.random() * letters.length));
            const number = numbers.charAt(Math.floor(Math.random() * numbers.length));
            password += letter + number;
        }

        return password;
    }
    const randomPassword = generateRandomPassword(8);

    cy.get('input[type="password"]').eq(0).type(randomPassword, { log: false }) 
    cy.get('input[type="password"]').eq(1).type(randomPassword, { log: false }) 
})

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
        ]).each((el) => {
            cy.contains(el[0])
                .invoke("attr", "href")
                .should("include", el[1]);
        })
    })
})

Cypress.Commands.add('invalidLogin', () => {
    cy.session('failUser', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get('input[name="username"]').type('3434')
        cy.get('input[name="password"]').type('3434')
        cy.saveButton().click()

        cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials')
    })
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

    cy.get('input[name="firstName"]').parent().next().should('have.text', 'Required')
    cy.get('input[name="lastName"]').parent().next().should('have.text', 'Required')
})

Cypress.Commands.add('hiringEmployee', () => {
    cy.get('input[type="file"]').selectFile('cypress/images/imatest.jpg', { force: true })   
    cy.get('input[name="firstName"]').type('Mitchell')
    cy.get('input[name="lastName"]').type('Harrell') 
    cy.get('.oxd-input--active')
        .eq(3).clear() 
        .type('7777')
})

Cypress.Commands.add('adminUserFail', () => {
    cy.saveButton().click()

    cy.get('.oxd-input-group__message').each(($el, index) => {
        if (index < 5) {
            cy.wrap($el).should('have.text', 'Required');
        } else if (index === 5) {
            cy.wrap($el).should('have.text', 'Passwords do not match');
        }
    });
})

Cypress.Commands.add('adminUser', () => {
    cy.get('.oxd-select-text--after').eq(0)
        .click()                            
    cy.contains('ESS').click()         

    cy.get('.oxd-select-text--after').eq(1)
        .click()                           
    cy.contains('Enabled').click()     

    cy.get('input[placeholder="Type for hints..."]').type(hireName) 
    cy.contains(hireName).click()
    cy.randomStringcreation() 
    cy.randomPassword() 
})


Cypress.Commands.add('formFillingNegative', () => {
    cy.saveButton().click()
    cy.get('.oxd-input-group__message').should('have.length', 3)
    cy.get('.oxd-input-group__message').each(($error) => {
        cy.wrap($error).should('have.text', 'Required')
    })
})

Cypress.Commands.add('formFilling', () => {
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="middleName"]').type('David')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[placeholder="Type here"]').eq(0).type('test@test.com') 
    cy.get('input[placeholder="Type here"]').eq(1).type('+506 88888888') 
    cy.get('input[type="file"]').selectFile('cypress/images/test.pdf', { force: true }) 
    cy.get('input[placeholder="Enter comma seperated words..."]').type('Příliš žluťoučký kůň úpěl ďábelské ódy') 
    cy.get('.oxd-textarea--resize-vertical').type('Nothing to add here') 
    cy.get('.oxd-checkbox-input-icon').click({ force: true }) 
    cy.saveButton().click() 
})

Cypress.Commands.add('failedVacancy', () => {
    cy.saveButton().click()
    cy.get('.oxd-input-group__message').should('have.length', 3)
    cy.get('.oxd-input-group__message').each(($error) => {
        cy.wrap($error).should('have.text', 'Required')
    })
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
    cy.get('.oxd-input-group__message').should('have.length', 4)
    cy.get('.oxd-input-group__message').each(($error) => {
        cy.wrap($error).should('have.text', 'Required');
    })
})

Cypress.Commands.add('vacancyApply', () => {
    cy.formFilling()
    
    cy.get('.orangehrm-text-center-align').should('have.text', 'Your application has been submitted successfully')
})

Cypress.Commands.add('shortlist', () => {
    cy.get('.oxd-select-text-input').eq(1).click()
    cy.get('div[role="listbox"]').contains('SDET').click()
    cy.saveButton().click()


    cy.get('.oxd-padding-cell').eq(9).should('have.text', candidateName)
    cy.saveButtonType().eq(5).click()
    cy.get('.oxd-text--p').eq(0).should('have.text', candidateName)
    cy.saveButtonType().eq(4).click()
    cy.get('.oxd-textarea--resize-vertical').type('Shortlisting application')
    cy.saveButton().click() 
    cy.log("shortlisting saved")
})

Cypress.Commands.add('interviewSchedule', () => {
    cy.get('.oxd-text--subtitle-2').should('have.text', 'Status: Shortlisted')
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
    cy.get('.oxd-text--p').eq(0).should('have.text', candidateName)

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
    cy.get('input[placeholder="Enter comma seperated words..."]').type('Příliš žluťoučký kůň úpěl ďábelské ódy')   //
    cy.searchButton().click()   
    cy.get('div[role="cell"]').eq(2).should('have.text', candidateName)   
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

    cy.get('.oxd-textarea').type('I just need some free time to learn Cypress.') 
    cy.saveButton().click() 
})

Cypress.Commands.add('deleteLeave', () => {
    cy.get('.--clear').eq(1).click()
    cy.get('div[role="cell"]').eq(7).should('have.text', 'I just need some free time to learn Cypress.')
    cy.get('.oxd-button--secondary').trigger('click')
    cy.contains('button[type="button"]', 'Cancel').click()
})

Cypress.Commands.add('postBuzz', () => {
    cy.get('.oxd-buzz-post-input').type('Test 1234 +++|||!"#$%')
    cy.saveButton().click()
})

Cypress.Commands.add('deleteBuzz', () => {
    cy.get('.orangehrm-buzz-post-body-text').eq(0).should('have.text', 'Test 1234 +++|||!"#$%')
      cy.saveButtonType().eq(8).click()
      cy.contains('Delete Post').click()
      cy.deleteConfirm().click()

})

Cypress.Commands.add('uploadFileFail', () => {
    cy.get('.oxd-button-icon').click()
    cy.saveButton().eq(2).click()
    cy.get('.oxd-input-group__message').should('have.text', 'Required')

})

Cypress.Commands.add('uploadFile', () => {
    cy.get('input[type="file"]').selectFile('cypress/images/imatest.jpg', { force: true })
    cy.get('textarea[placeholder="Type comment here"]').type('Text image posted')
    cy.saveButton().eq(2).click()
    cy.get('.orangehrm-container', { timeout: 10000 }).contains('Text image posted').should('exist')
})

// LOCATOR SECTION

Cypress.Commands.add('saveButton', () => {
    cy.get('button[type="submit"]', {timeout : 6000})
})

Cypress.Commands.add('saveButtonType', () => {
    cy.get('button[type="button"]', {timeout : 6000})
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



