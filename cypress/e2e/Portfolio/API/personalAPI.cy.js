import { faker } from '@faker-js/faker';
import useCases from '../API/apiValidationUseCases.json';


const user = faker.internet.userName()
const job = faker.person.jobTitle()
const keyword = faker.food.vegetable()
const RandExp = require('randexp');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const randomPassword = new RandExp(passwordRegex).gen()

describe("Suite API for Bookstore", { tags: ['smoke', 'api'] }, () => {

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
        })
    })

    it('Invalid API', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("demoqa")}/BookStore/v1/Books`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).not.be.eq(200)
        })
    })
})

describe("Happy path for general login Flow", { tags: ['smoke', 'api'] }, () => {
    it('Creating a new user', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("reqres")}/api/users`,
            body: {
                name: user,
                job: job,
                id: 15
            }
        }).then((response) => {
            expect(response.status).to.be.eq(201)
        })
    })

    it('Successful Login', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("reqres")}/api/login`,
            body: {
                email: "eve.holt@reqres.in",
                password: "cityslicka"
            }
        }).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.token).to.exist
        })
    })

    it('Searching for non-existing user', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env("reqres")}/api/users/7442`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.be.eq(404)
        })
    })

})

describe("Negative path API general login validation", { tags: ['smoke', 'api'] }, () => {
    for (let { nameUseCase, requestBody, responseBody } of useCases) {

        it(`Use Case: ${nameUseCase}`, () => {
            cy.request({
                method: 'POST',
                url: `${Cypress.env("reqres")}/api/login`,
                body: requestBody,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.deep.eq(responseBody)
            })
        })
    }
})