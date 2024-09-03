describe('User Story | Orange HRM | STORY-007', function() {
  beforeEach('Precondition: Admin must have login set up', ()=>{
      cy.invalidLogin() 
      cy.loginOrange() 
  })

  it('TC01: Confirming left panel section contains expected field titles', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/dashboard/index`)

    cy.menuValidation()
})

  it('TC02: Creating Hiring information', () => {
      cy.intercept('POST', '/web/index.php/api/v2/pim/employees').as('hiringUser'); 
      cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/addEmployee`)

      cy.hiringEmployeeNegative()

      cy.hiringEmployee()
      cy.saveButton().click()

      cy.wait('@hiringUser').then((request)=>{
        cy.log('This request is intercepted', request)
        expect(request.response.statusCode).to.be.equal(200);
        expect(request.request.method).to.be.equal('POST');
        expect(request.response.body.data.employeeId).to.be.equal('7777')
      })
  });

  it('TC03: Add a System User to the admin panel', () => { 
      cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/admin/saveSystemUser`)            
      cy.intercept('POST', '/web/index.php/api/v2/admin/users').as('addAdmin'); 

      cy.adminUserFail()
      cy.adminUser()
      cy.saveButton().click() 

      cy.wait('@addAdmin').then((request)=>{
        cy.log('This request is intercepted', request)
        expect(request.response.statusCode).to.be.equal(200);
        expect(request.request.method).to.be.equal('POST'); 
        expect(request.response.body.data.userRole.displayName).to.be.equal("ESS")
      })
  });

  it('TC04: Adding candidate information', () => {
    cy.intercept('POST', '/web/index.php/api/v2/recruitment/candidates').as('candidateAdded');
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/addCandidate`)
    cy.url().should('include', 'recruitment/addCandidate')

    cy.formFillingNegative()
    cy.formFilling()

    cy.wait("@candidateAdded").then((request)=>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
    })                                                                    
  });

  it('TC05: Adding a vacancy for SDET', () => {
    cy.intercept('POST', '/web/index.php/api/v2/recruitment/vacancies').as('vacancyAdded')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/addJobVacancy`)

    cy.failedVacancy()
    cy.addingVacancy()

    cy.wait('@vacancyAdded').then((request)=>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
      expect(request.request.body.isPublished).to.be.equal(true)
    })
  });

  it('TC06: Checking SDET position and applying', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitmentApply/jobs.html`)
    cy.intercept('POST', '/web/index.php/recruitment/public/applicants').as('applicationSent')

    cy.vacancyApplyFail()
    cy.vacancyApply()

    cy.wait("@applicationSent").its("response.statusCode").should("eq", 302);

  });

  it('TC07: Shortlisting and interviewing applicant for SDET position', () => {
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/viewCandidates`)

    cy.shortlist()

    cy.interviewSchedule()

    cy.interviewPassed()

    cy.jobOffer()

    cy.verificationHire()

  })

  it('TC08: Delete the vacancy for SDET', () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/recruitment/vacancies').as('vacancyDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/viewJobVacancy`)

    cy.deleteVacancy()

    cy.wait('@vacancyDeleted').then((request)=>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('DELETE');
    })
  });

  it('TC9: Delete Hiring info from TC01', () => {

    cy.intercept('DELETE', '/web/index.php/api/v2/pim/employees').as('hiringDeleted'); 
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/viewEmployeeList`)
    cy.url().should('include', 'viewEmployeeList')

    cy.deleteHiringInfo()

    cy.wait('@hiringDeleted').then((request)=>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('DELETE');   
    }) 
  });

  it('TC10: Delete Candidate info from TC03', () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/recruitment/candidates').as('candidateDeleted');
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/recruitment/viewCandidates`)

    cy.deleteCandidate()

    cy.wait('@candidateDeleted').then((request)=>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('DELETE');
    })
  });

  it('TC11: Applying for a leave', () => {
    cy.intercept('POST', '/web/index.php/api/v2/leave/leave-requests').as('leaveSent')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/leave/applyLeave`)

    cy.applyLeave()

    cy.wait('@leaveSent').then((request)=>{
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
      expect(request.request.body.duration.type).to.be.equal('half_day_morning')  
    })     
  });

  it('TC12: Delete Leave apply', () => {
    cy.intercept('PUT', '/web/index.php/api/v2/leave/employees/leave-requests/**').as('leaveDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/leave/viewMyLeaveList`)

    cy.deleteLeave()

   cy.wait('@leaveDeleted').then((request)=>{
    expect(request.response.statusCode).to.be.equal(200);
    expect(request.request.method).to.be.equal('PUT');
   })
  });

  it('TC13: Upload a post to the Newsfeed', () => {
    cy.intercept('POST', '/web/index.php/api/v2/buzz/posts').as('buzzPost')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/buzz/viewBuzz`)

    cy.postBuzz()
    
    cy.wait('@buzzPost').then((request)=>{
      const postID = request.response.body.data.post.id;
      cy.wrap(postID).as('IDpost');
      cy.log('This request is intercepted', request)
      expect(request.response.statusCode).to.be.equal(200);
      expect(request.request.method).to.be.equal('POST');
     })
  });

   it('TC14: Delete post on Newsfeed', () => {
    cy.intercept('DELETE', '/web/index.php/api/v2/buzz/shares/**').as('postDeleted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/buzz/viewBuzz`)

    cy.deleteBuzz()
    
   cy.wait('@postDeleted').then((request)=>{
    cy.log('This request is intercepted', request)
    expect(request.response.statusCode).to.be.equal(200);
   })
  });

  it('TC:15 Upload a file and validate its result', () => {
    cy.intercept('POST' , '/web/index.php/api/v2/pim/employees/7/screen/personal/attachments').as('attachmentPosted')
    cy.visit(`${Cypress.env("OrangeHRM")}/web/index.php/pim/viewPersonalDetails/empNumber/7`)

    cy.uploadFileFail()
    cy.uploadFile()

    cy.wait('@attachmentPosted').then((request)=>{
      cy.log('Post was intercepted', request)
      expect(request.response.statusCode).to.be.equal(200)
      expect(request.request.body.description).to.be.equal('Text image posted')
    })
});
})