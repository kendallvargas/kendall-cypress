import { faker } from '@faker-js/faker';

describe("Suite API", () => {
    const user = faker.internet.userName()
    const RandExp = require('randexp');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const randomPassword = new RandExp(passwordRegex).gen()


    it('Bookstore section', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env("demoqa")}/BookStore/v1/Books`,
        }).then((response) => {
            cy.log('Books are having expected data structure').then(() => {
                expect(response.body.books).to.be.an('array')
            })
            cy.log('Correct amount of books').then(() => {
                expect(response.body.books.length).to.be.equal(8)
            })

            cy.log('Validating correct author name').then(() => {
                expect(response.body.books[0].author).to.be.equal('Richard E. Silverman')
            })
            cy.log('Validating pages').then(() => {
                expect(response.body.books[0].pages).to.be.equal(234)
            })
            cy.log('Validating ISBN is not empty').then(() => {
                const isbn = response.body.books[0].isbn;
                expect(isbn).to.not.be.empty
                if (isbn.length === 13) {
                    cy.log(`Expected length: ${isbn.length}`)
                } else {
                    cy.log(`Length is not the expected one, current result: ${isbn.length}`)
                }
            })
        })
    })

    // only run when new account needs to be created
    it('Creating account', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("demoqa")}/Account/v1/User`,
            body: {
                userName: user,
                password: randomPassword,
            },
        }).then((response) => {
            expect(response.body.username).to.be.equal(user)
            const userID = response.body.userID
            cy.wrap(userID).as('IDuser')
        })
    })

    it('Getting auth token del login', () => {
        
        cy.request({
            failOnStatusCode: false,
            method: 'POST',
            url: `${Cypress.env("demoqa")}/Account/v1/GenerateToken`,
            body: {
                userName: user,
                password: randomPassword,
            },
        }).then((response) => {
            const tokenID = response.body.token
            cy.wrap(tokenID).as('testToken')
            cy.log(tokenID)
        })
    })

    it('Retrieving the data from the login using token', function () {
        const tokenID = this.testToken
        const userID = this.IDuser
        const authorization = `Bearer ${tokenID}`
        const request = {
            method: 'GET',
            url: `${Cypress.env("demoqa")}/account/v1/User/${userID}`,
            headers: {
                authorization,
            },
        }
        cy.request(request).then((response) => {
            cy.log('Validating status').then(() => {
                expect(response.status).to.be.equal(200)
            })
            cy.log('Validating expected username').then(() => {
                expect(response.body.username).to.be.equal(user)
            })
        })
    });

    it('Invalid API', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("demoqa")}/BookStore/v1/Books`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).not.be.eq(200)
        })
    });
})