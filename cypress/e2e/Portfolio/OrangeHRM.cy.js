describe('OrangeHRM Test Suite', { tags: ['smoke', 'e2e']}, () => {
  beforeEach('Randomizing viewport and signing in before each it', () => {
    cy.setViewport();
    cy.loginOrange()
  })

  it('Confirming left panel section contains expected field titles', { tags : 'positive' }, () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/dashboard/index`)

    cy.get('.oxd-main-menu-item-wrapper').should('have.length', 12)
    cy.menuValidation()
    cy.get('@menuItems').each((el) => {
      cy.contains(el[0])
        .invoke("attr", "href")
        .should("include", el[1]);
    })
  });

  it('Invalid Login Test', { tags : 'negative' }, () => {
    cy.clearCookies(); 
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.invalidLogin()
    cy.get('.oxd-alert-content-text')
      .should('have.text', 'Invalid credentials')
  });


  it('Invalid Hiring Information Section', { tags : 'negative' }, () => {
    cy.visit(`${Cypress.env("AddEmployee")}`)

    cy.hiringEmployeeNegative()
    cy.errorMessage().each((error) => {
      cy.wrap(error)
        .should('have.text', 'Required');
    })
  });

  it('Creating Hiring information', { tags : 'positive' }, () => {
    cy.intercept('POST', '/web/index.php/api/v2/pim/employees').as('hiringUser');
    cy.visit(`${Cypress.env("AddEmployee")}`)

    cy.hiringEmployee()
    cy.saveButton().click()

    cy.wait('@hiringUser').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.response.body.data.employeeId).to.be.equal('7777')
    })
  });

  it('Invalid adding user to admin panel: Required errors', { tags : 'negative' }, () => {
    cy.visit(`${Cypress.env("SaveSystemUser")}`)

    cy.saveButton().click()
    cy.errorMessage().filter(':contains("Required")')
      .should('have.length', 5);
  });

  it('Invalid adding user to admin panel: Password error', { tags : 'negative' }, () => {
    cy.visit(`${Cypress.env("SaveSystemUser")}`)

    cy.saveButton().click()
    cy.errorMessage().filter(':contains("Passwords do not match")')
      .should('have.length', 1);
  });

  it('Add a System User to the admin panel', { tags : 'positive' }, () => {
    cy.visit(`${Cypress.env("SaveSystemUser")}`)
    cy.intercept('POST', '/web/index.php/api/v2/admin/users').as('addAdmin');

    cy.adminUser()
    cy.wait('@addAdmin').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.response.body.data.userRole.displayName).to.be.equal("ESS")
    })
  });


  it('Invalid candidate information', { tags : 'negative' }, () => {
    cy.visit(`${Cypress.env("AddCandidate")}`)

    cy.saveButton().click()
    cy.errorMessage().should('have.length', 3)
    cy.errorMessage().each(($error) => {
      cy.wrap($error).should('have.text', 'Required')
    })
  });

  it('Adding candidate information', { tags : 'positive' }, () => {
    cy.intercept('POST', '/web/index.php/api/v2/recruitment/candidates').as('candidateAdded');
    cy.visit(`${Cypress.env("AddCandidate")}`)

    cy.formFilling()
    cy.wait("@candidateAdded").then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });


  it('Invalid vacancy for SDET', { tags : 'negative' }, () => {
    cy.visit(`${Cypress.env("JobVacancy")}`)

    cy.saveButton().click()
    cy.errorMessage().should('have.length', 3)
    cy.errorMessage().each(($error) => {
      cy.wrap($error).should('have.text', 'Required')
    })
  });

  it('Adding a vacancy for SDET', { tags : 'positive' }, () => {
    cy.intercept('POST', '/web/index.php/api/v2/recruitment/vacancies').as('vacancyAdded')
    cy.visit(`${Cypress.env("JobVacancy")}`)

    cy.addingVacancy()
    cy.wait('@vacancyAdded').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.body.isPublished).to.be.equal(true)
    })
  });

  it('Invalid application', { tags : 'negative' }, () => {
    cy.visit(`${Cypress.env("CheckJobPosition")}`)

    cy.vacancyApplyFail()
    cy.errorMessage().should('have.length', 4)
    cy.errorMessage().each(($error) => {
      cy.wrap($error).should('have.text', 'Required');
    })
  });

  it('Checking SDET position and applying', { tags : 'positive' }, () => {
    cy.visit(`${Cypress.env("CheckJobPosition")}`)
    cy.intercept('POST', '/web/index.php/recruitment/public/applicants').as('applicationSent')

    cy.vacancyApply()    
    cy.get('.orangehrm-text-center-align').should('have.text', 'Your application has been submitted successfully')

    cy.wait("@applicationSent").its("response.statusCode").should("eq", 302);

  });

  it('Shortlisting the application for SDET position', { tags : 'positive' }, () => {
    cy.visit(`${Cypress.env("CandidatePage")}`)
    cy.intercept('PUT', '/web/index.php/api/v2/recruitment/candidates/**').as('shortlistSuccessful')

    cy.get('.oxd-select-text-input').eq(1).click()
    cy.get('div[role="listbox"]').contains('SDET').click()
    cy.saveButton().click()
    cy.shortlist()
    cy.candidateStatus()
      .should('include.text', 'Status: Shortlisted')
    cy.url().then((url)=>{
      const interviewURL = url
      cy.wrap(interviewURL).as('URLinterview')

    })
    cy.wait('@shortlistSuccessful').then((request) =>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200)

    })
  });

  it('Interviewing the Applicant', { tags : 'positive' }, function () {
    const interviewURL = this.URLinterview
    cy.visit(`${interviewURL}`)
    cy.intercept('POST', '/web/index.php/api/v2/recruitment/candidates/**').as('interviewSuccessful')

    cy.interviewSchedule()
    cy.candidateStatus()
      .should('include.text', 'Status: Interview Scheduled')
    cy.url().then((url)=>{
      const interviewSuccessURL = url
      cy.wrap(interviewSuccessURL).as('URLscheduled')

    })
    cy.wait('@interviewSuccessful').then((request) =>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200)
    })
  });

  it('Marking the interview as passed', { tags : 'positive' }, function () {
    const interviewSuccessURL = this.URLscheduled
    cy.visit(`${interviewSuccessURL}`)
    cy.intercept('PUT', '/web/index.php/api/v2/recruitment/candidates/**').as('interviewPassed')

    cy.interviewPassed()
    cy.candidateStatus()
      .should('contain', 'Interview Passed')

    cy.url().then((url)=>{
      const interviewPassedURL = url
      cy.wrap(interviewPassedURL).as('URLpassed')
    })  

    cy.wait('@interviewPassed').then((request) =>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200)
    })
  });

  it('Offering Job', { tags : 'positive' }, function () {
    const interviewPassedURL = this.URLpassed
    cy.visit(`${interviewPassedURL}`)
    cy.intercept('PUT', '/web/index.php/api/v2/recruitment/candidates/**').as('jobOffer')
    
    cy.jobOffer()    
    cy.candidateStatus()
      .should('contain', 'Job Offered')

    cy.url().then((url)=>{
      const hireVerification = url
      cy.wrap(hireVerification).as('URLhire')
    }) 
      
    cy.wait('@jobOffer').then((request) =>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200)
    })
  })

  it('Marking applicant as Hired', { tags : 'positive' }, function () {
    const hireVerification = this.URLhire
    cy.visit(`${hireVerification}`)
    cy.intercept('PUT', '/web/index.php/api/v2/recruitment/candidates/**').as('appHired')
    
    cy.verificationHire()    
    cy.candidateStatus()
      .should('contain', 'Hired')
      
    cy.wait('@appHired').then((request) =>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200)
    })
  })

  it('Delete the vacancy for SDET', { tags : 'delete' }, () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/recruitment/vacancies').as('vacancyDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/viewJobVacancy`)

    cy.deleteVacancy()
    cy.wait('@vacancyDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });

  it('Delete Hiring info from TC04', { tags : 'delete' }, () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/pim/employees').as('hiringDeleted');
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/viewEmployeeList`)
    
    cy.deleteHiringInfo()
    cy.wait('@hiringDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });

  it('Delete Candidate info from @addAdmin', { tags : 'delete' }, () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/recruitment/candidates').as('candidateDeleted');
    cy.visit(`${Cypress.env("CandidatePage")}`)

    cy.deleteCandidate()
    cy.wait('@candidateDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });

  it('Applying for a leave', { tags : 'positive' }, () => {
    cy.intercept('POST', '/web/index.php/api/v2/leave/leave-requests').as('leaveSent')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/leave/applyLeave`)

    cy.applyLeave()
    cy.wait('@leaveSent').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.body.duration.type).to.be.equal('half_day_morning')
    })
  });

  it('Delete Leave apply', { tags : 'delete' }, () => {
    cy.intercept('PUT', '/web/index.php/api/v2/leave/employees/leave-requests/**').as('leaveDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/leave/viewMyLeaveList`)

    cy.deleteLeave()
    cy.wait('@leaveDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });

  it('Upload a post to the Newsfeed', { tags : 'positive' }, () => {
    cy.intercept('POST', '/web/index.php/api/v2/buzz/posts').as('buzzPost')
    cy.visit(`${Cypress.env("PostPage")}`)

    cy.postBuzz()
    cy.wait('@buzzPost').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });
    
  it('Delete post on Newsfeed', { tags : 'delete' }, () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/buzz/shares/**').as('postDeleted')
    cy.visit(`${Cypress.env("PostPage")}`)

    cy.deleteBuzz()
    cy.wait('@postDeleted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200);
    })
  });

  it('Fail to add a file', { tags : 'negative' }, () => {
    cy.visit(`${Cypress.env("ownerPage")}`)

    cy.uploadFileFail()
    cy.errorMessage().should('have.text', 'Required')
  })

  it('Upload a file and validate its result', { tags : 'positive' }, () => {
    cy.intercept('POST', '/web/index.php/api/v2/pim/employees/7/screen/personal/attachments').as('attachmentPosted')
    cy.visit(`${Cypress.env("ownerPage")}`)

    cy.uploadFile()
    cy.get('.orangehrm-container', { timeout: 10000 }).contains('Test image posted').should('be.visible')
    cy.wait('@attachmentPosted').then((request) => {
      expect(request.response.statusCode).to.be.equal(200)
      expect(request.request.body.description).to.be.equal('Test image posted')
    })
  });
})


