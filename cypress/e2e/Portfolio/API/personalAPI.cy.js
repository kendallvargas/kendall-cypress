describe("Suite API", () => {

    it('Bookstore section', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env("demoqa")}/BookStore/v1/Books`,
        }).then((response) => {
            cy.log('Books are having expected data structure').then(()=>{
                expect(response.body.books).to.be.an('array')
            })
            cy.log('Correct amount of books').then(()=>{
                expect(response.body.books.length).to.be.equal(8)
            })

            cy.log('Validating correct author name').then(() => {
                expect(response.body.books[0].author).to.be.equal('Richard E. Silverman')
            })
            cy.log('Validating pages').then(()=>{
                expect(response.body.books[0].pages).to.be.equal(234)
            })
            cy.log('Validating ISBN is not empty').then(()=>{
                const isbn = response.body.books[0].isbn;
                expect(isbn).to.not.be.empty
                if (isbn.length === 13){
                    cy.log(`Expected length: ${isbn.length}`)
                }else{
                    cy.log(`Length is not the expected one, current result: ${isbn.length}`)
                }
            })
        })
    })

    // only run when new account needs to be created
    it.skip('Creating account', () => {
            cy.request({
                method: 'POST',
                url: `${Cypress.env("demoqa")}/Account/v1/User`,
                body: {
                    userName: 'tetetsteste',
                    password: "P@ssw0rd!1",
                },
            }).then((response) => {
                cy.log('Validating username').then(() => {
                    expect(response.body.username).to.be.equal('tetetsteste')
                })
            })
      
    });

    it('Getting auth token del login', () => {
        const userID = '08ade489-247b-47ca-95d7-bd10ebb3bc16'
        cy.wrap(userID).as('userAccountID')
        cy.log(userID)
        cy.request({
            method: 'POST',
            url: `${Cypress.env("demoqa")}/Account/v1/GenerateToken`,
            body: {
                userName: "testtesterss",
                password: "P@ssw0rd!1",
            },
        }).then((response)=>{
            const tokenID = response.body.token
            cy.wrap(tokenID).as('testToken')
            cy.log(tokenID)
        })
    })

    it('Retrieving the data from the login using token', function () {
        const tokenID = this.testToken
        const userID = this.userAccountID
        const authorization = `Bearer ${tokenID}`
        const request = {
            method: 'GET',
            url: `${Cypress.env("demoqa")}/account/v1/User/${userID}`,
            headers: {
                authorization,
              },
        }
        cy.request(request).then((response)=>{
            cy.log('Validating status').then(()=>{
                expect(response.status).to.be.equal(200)
            })
            cy.log('Validating expected username').then(()=>{
                expect(response.body.username).to.be.equal('testtesterss')
            })
        })
    });

    it('Invalid API', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("demoqa")}/BookStore/v1/Books`,
            failOnStatusCode: false,
        }).then((response)=>{
            expect(response.status).not.be.eq(200)
        })
    });
})