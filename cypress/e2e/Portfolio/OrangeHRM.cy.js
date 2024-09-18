describe('User Story | Orange HRM | STORY-007', () => {
  beforeEach('Precondition: Admin must have login set up', () => {
    cy.setViewport();
    cy.loginOrange()
  })

  it('TC01: Confirming left panel section contains expected field titles', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/dashboard/index`)

    cy.menuValidation()
    cy.get('@menuItems').each((el) => {
      cy.contains(el[0])
        .invoke("attr", "href")
        .should("include", el[1]);
    })
  });

  it('TC02: Invalid Login Test', () => {
    cy.clearCookies(); 
    cy.invalidLogin()
    cy.get('.oxd-alert-content-text')
      .should('have.text', 'Invalid credentials')
  });


  it('TC03: Invalid Hiring Information Section', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/addEmployee`)

    cy.hiringEmployeeNegative()
    cy.errorMessage().each((error) => {
      cy.wrap(error)
        .should('have.text', 'Required');
    })
  });

  it('TC04: Creating Hiring information', () => {
    cy.intercept('POST', '/web/index.php/api/v2/pim/employees').as('hiringUser');
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/addEmployee`)

    cy.hiringEmployee()
    cy.saveButton().click()

    cy.wait('@hiringUser').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
      expect(request.response.body.data.employeeId).to.be.equal('7777')
    })
  });

  it('TC05: Invalid adding user to admin panel', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/admin/saveSystemUser`)

    cy.saveButton().click()
    cy.errorMessage().each(($el, index) => {
      if (index < 5) {
        cy.wrap($el).should('have.text', 'Required');
      } else if (index === 5) {
        cy.wrap($el).should('have.text', 'Passwords do not match');
      }
    })
  });

  it('TC06: Add a System User to the admin panel', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/admin/saveSystemUser`)
    cy.intercept('POST', '/web/index.php/api/v2/admin/users').as('addAdmin');

    cy.adminUser()
    cy.wait('@addAdmin').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
      expect(request.response.body.data.userRole.displayName).to.be.equal("ESS")
    })
  });


  it('TC07: Invalid candidate information', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/addCandidate`)

    cy.saveButton().click()
    cy.errorMessage().should('have.length', 3)
    cy.errorMessage().each(($error) => {
      cy.wrap($error).should('have.text', 'Required')
    })
  });

  it('TC08: Adding candidate information', () => {
    cy.intercept('POST', '/web/index.php/api/v2/recruitment/candidates').as('candidateAdded');
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/addCandidate`)

    cy.formFilling()
    cy.wait("@candidateAdded").then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
    })
  });


  it('TC09: Invalid vacancy for SDET', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/addJobVacancy`)

    cy.saveButton().click()
    cy.errorMessage().should('have.length', 3)
    cy.errorMessage().each(($error) => {
      cy.wrap($error).should('have.text', 'Required')
    })
  });

  it('TC10: Adding a vacancy for SDET', () => {
    cy.intercept('POST', '/web/index.php/api/v2/recruitment/vacancies').as('vacancyAdded')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/addJobVacancy`)

    cy.addingVacancy()
    cy.wait('@vacancyAdded').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
      expect(request.request.body.isPublished).to.be.equal(true)
    })
  });

  it('TC11: Invalid application', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitmentApply/jobs.html`)

    cy.vacancyApplyFail()
    cy.errorMessage().should('have.length', 4)
    cy.errorMessage().each(($error) => {
      cy.wrap($error).should('have.text', 'Required');
    })
  });

  it('TC12: Checking SDET position and applying', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitmentApply/jobs.html`)
    cy.intercept('POST', '/web/index.php/recruitment/public/applicants').as('applicationSent')

    cy.vacancyApply()    
    cy.get('.orangehrm-text-center-align').should('have.text', 'Your application has been submitted successfully')

    cy.wait("@applicationSent").its("response.statusCode").should("eq", 302);

  });

  it('TC13: Shortlisting and interviewing applicant for SDET position', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/viewCandidates`)

    cy.shortlist()

    cy.interviewSchedule()

    cy.interviewPassed()

    cy.jobOffer()

    cy.verificationHire()

  });

  it('TC14: Delete the vacancy for SDET', () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/recruitment/vacancies').as('vacancyDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/viewJobVacancy`)

    cy.deleteVacancy()
    cy.wait('@vacancyDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('DELETE');
    })
  });

  it('TC15: Delete Hiring info from TC04', () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/pim/employees').as('hiringDeleted');
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/viewEmployeeList`)
    cy.url().should('include', 'viewEmployeeList')

    cy.deleteHiringInfo()
    cy.wait('@hiringDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('DELETE');
    })
  });

  it('TC16: Delete Candidate info from TC06', () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/recruitment/candidates').as('candidateDeleted');
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/viewCandidates`)

    cy.deleteCandidate()
    cy.wait('@candidateDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('DELETE');
    })
  });

  it('TC17: Applying for a leave', () => {
    cy.intercept('POST', '/web/index.php/api/v2/leave/leave-requests').as('leaveSent')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/leave/applyLeave`)

    cy.applyLeave()
    cy.wait('@leaveSent').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
      expect(request.request.body.duration.type).to.be.equal('half_day_morning')
    })
  });

  it('TC18: Delete Leave apply', () => {
    cy.intercept('PUT', '/web/index.php/api/v2/leave/employees/leave-requests/**').as('leaveDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/leave/viewMyLeaveList`)

    cy.deleteLeave()
    cy.wait('@leaveDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('PUT');
    })
  });

  it('TC19: Upload a post to the Newsfeed', () => {
    cy.intercept('POST', '/web/index.php/api/v2/buzz/posts').as('buzzPost')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/buzz/viewBuzz`)

    cy.postBuzz()
    cy.wait('@buzzPost').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
    })
  });

  it('TC20: Delete post on Newsfeed', () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/buzz/shares/**').as('postDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/buzz/viewBuzz`)

    cy.deleteBuzz()
    cy.wait('@postDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });

  it('TC21: Upload a file and validate its result', () => {
    cy.intercept('POST', '/web/index.php/api/v2/pim/employees/7/screen/personal/attachments').as('attachmentPosted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/viewPersonalDetails/empNumber/7`)

    cy.uploadFileFail()
    cy.errorMessage().should('have.text', 'Required')

    cy.uploadFile()
    cy.get('.orangehrm-container', { timeout: 10000 }).contains('Test image posted').should('be.visible')
    cy.wait('@attachmentPosted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200)
      expect(request.request.body.description).to.be.equal('Test image posted')
    })
  });
})


