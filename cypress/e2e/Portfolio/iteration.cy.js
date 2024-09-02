describe('Iteration practice Cypress website', () => {

    it('IC01: Iterating and checking first value expects second value', () => {
        cy.visit(`${Cypress.env("cypressweb")}/api/commands/each`)

        cy.get('.footer--dark').within(() => {
            cy.get('.footer__item').should('have.length', 13)
            cy.wrap([
                [/real world app/i, "cypress-io/cypress-realworld-app"],
                [/real world testing/i, "learn.cypress.io"],
                [/cypress.io youtube/i, "youtube.com"],
                [/github discussions/i, "cypress-io/cypress/discussions"],
                [/discord/i, "cypress.io/discord"],
                [/twitter/i, "twitter.com/Cypress_io"],
                [/cypress app/i, "cypress.io/features"],
                [/cypress cloud/i, "cypress.io/cloud"],
                [/cypress migrator/i, "migrator.cypress.io"],
                [/about/i, "cypress.io/about"],
                [/cypress blog/i, "cypress.io/blog"],
                [/careers/i, "cypress.io/careers"],
                [/support/i, "cypress.io/support"]
            ]).each((el) => {
                cy.contains(el[0])
                    .invoke("attr", "href")
                    .should("include", el[1]);
            })
        })
    });

    it('TC02: Iterating title and validating has expected text', () => {
        cy.visit(`${Cypress.env("cypressweb")}/api/commands/each`)

        cy.get('.footer--dark').within(() => {
            cy.get('.footer__title').should('have.length', 4)
            cy.wrap([
                'Learn',
                'Community',
                'Solutions',
                'Company',
            ]).each((el) => {
                cy.contains(el)
                    .invoke('text')
                    .should("contain", el);
            })
        })
    })

    it('TC03: Dropdown menu section, validating class and link redirection is correct', () => {
        cy.visit(`${Cypress.env("cypressweb")}/api/commands/as`)
        cy.get('.navbar__inner').within(() => {
            cy.get('.navbar__link').should('have.length', 6)
            cy.wrap([
                [/guides/i, 'guides/overview/why-cypress'],
                [/api/i, 'api/table-of-contents'],
                [/plugins/i, 'plugins'],
                [/examples/i, 'examples/recipes'],
                [/faq/i, 'faq/questions/using-cypress-faq'],
                [/learn/i, 'learn.cypress.io']

            ]).each((el) => {
                cy.contains(el[0])
                    .invoke('attr', 'href')
                    .should('contain', el[1])
            })
        })
    });
})

