import faker from 'faker';

const emailInput = () => cy.get('form [type="email"]');
const usernameInput = () => cy.get('form [name="username"]');
const passwordInput = () => cy.get('form [type="password"]');
const isOwnerCheckbox = () => cy.get('form [type="checkbox"]');
const submitBtn = () => cy.get('form [type="submit"]');

const user = {
  email: 'e2e_user_' + faker.internet.email(),
  username: 'e2e_user_' + faker.internet.userName(),
  password: Cypress.env('password')
};
const owner = {
  email: 'e2e_owner_' + faker.internet.email(),
  username: 'e2e_owner_' + faker.internet.userName(),
  password: Cypress.env('password')
};

describe('User', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
    cy.clearCookies();
  });

  it('Can Sign Up', () => {
    cy.visit(Cypress.env('signup_url'));

    emailInput().should('exist');
    usernameInput().should('exist');
    passwordInput().should('exist');
    submitBtn().should('exist');

    emailInput().type(user.email);
    usernameInput().type(user.username);
    passwordInput().type(user.password);
    submitBtn().click();

    // should see home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('body').contains('Popular Restaurants').should('exist');
    cy.get('nav').contains('Manage').should('not.exist');
  });

  it('Can Login', () => {
    cy.visit(Cypress.env('login_url'));
    usernameInput().should('exist');
    passwordInput().should('exist');
    usernameInput().type(user.username);
    passwordInput().type(user.password);
    submitBtn().click();
    // should see home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('body').contains('Popular Restaurants').should('exist');
    cy.get('nav').contains('Manage').should('not.exist');
  });
});

describe('Owner', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
    cy.clearCookies();
  });

  it('Can Sign Up', () => {
    cy.visit(Cypress.env('signup_url'));

    emailInput().should('exist');
    usernameInput().should('exist');
    passwordInput().should('exist');
    submitBtn().should('exist');

    emailInput().type(owner.email);
    usernameInput().type(owner.username);
    passwordInput().type(owner.password);
    isOwnerCheckbox().check({ force: true });
    submitBtn().click();

    // should see management page
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/me/restaurants/managements'
    );
    cy.contains('Add New Restaurant').should('exist');
    cy.get('nav').contains('Manage').should('exist');
    cy.get('nav').contains('Manage My Restaurants').should('exist');
  });

  it('Can Login', () => {
    cy.visit(Cypress.env('login_url'));
    usernameInput().should('exist');
    passwordInput().should('exist');
    usernameInput().type(owner.username);
    passwordInput().type(owner.password);
    submitBtn().click();

    // should see management page
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/me/restaurants/managements'
    );
    cy.contains('Add New Restaurant').should('exist');
    cy.get('nav').contains('Manage').should('exist');
    cy.get('nav').contains('Manage My Restaurants').should('exist');
  });
});
