import faker from 'faker';

const emailInput = () => cy.get('form [type="email"]');
const nameInput = () => cy.get('form [name="name"]');
const passwordInput = () => cy.get('form [type="password"]');
const isOwnerCheckbox = () => cy.get('form [type="checkbox"]');
const submitBtn = () => cy.get('form [type="submit"]');

const admin = {
  email: 'jacobgoh101@gmail.com',
  name: 'Admin',
  password: 'Pa$$w0rd!',
};
const user = {
  email: 'e2e_user_' + faker.internet.email(),
  name: 'e2e_user_' + faker.internet.userName(),
  password: Cypress.env('password'),
};
const owner = {
  email: 'e2e_owner_' + faker.internet.email(),
  name: 'e2e_owner_' + faker.internet.userName(),
  password: Cypress.env('password'),
};

describe('User', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
    cy.clearCookies();
  });

  it('Can Sign Up', () => {
    cy.visit(Cypress.env('signup_url'));

    emailInput().should('exist');
    nameInput().should('exist');
    passwordInput().should('exist');
    submitBtn().should('exist');

    emailInput().type(user.email);
    nameInput().type(user.name);
    passwordInput().type(user.password);
    submitBtn().click();

    // should see home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('body')
      .contains('A verification link has been sent to your email account.')
      .should('exist');
    // signup login button should still exists, as user is pending verification
    cy.get('body').contains('Sign up').should('exist');
    cy.get('body').contains('Log in').should('exist');
    cy.get('nav').contains('Manage').should('not.exist');
  });

  it(`Can't Sign Up with the same email`, () => {
    cy.visit(Cypress.env('signup_url'));

    emailInput().should('exist');
    nameInput().should('exist');
    passwordInput().should('exist');
    submitBtn().should('exist');

    emailInput().type(user.email);
    nameInput().type(user.name);
    passwordInput().type(user.password);
    submitBtn().click();

    // should stay in sign up page
    cy.url().should('eq', Cypress.config().baseUrl + '/signup');
    // should see error message
    cy.get('.notification')
      .contains('Email is already used by an existing account')
      .should('exist');
    // signup login button should still exists, as user is pending verification
    cy.get('body').contains('Sign up').should('exist');
    cy.get('body').contains('Log in').should('exist');
    cy.get('nav').contains('Manage').should('not.exist');
  });

  it(`Can't Login Due to Pending Email Veifification`, () => {
    cy.visit(Cypress.env('login_url'));
    emailInput().should('exist');
    passwordInput().should('exist');
    emailInput().type(user.email);
    passwordInput().type(user.password);
    submitBtn().click();
    // should see home page
    cy.url().should('eq', Cypress.config().baseUrl + '/login');
    cy.get('body')
      .contains('This email is pending verification. Please check your inbox')
      .should('exist');
    cy.get('nav').contains('Manage').should('not.exist');
  });

  it(`Can't Login with the wrong password`, () => {
    cy.visit(Cypress.env('login_url'));
    emailInput().should('exist');
    passwordInput().should('exist');
    emailInput().type(user.email);
    passwordInput().type(user.password + 'random');
    submitBtn().click();
    // should see home page
    cy.url().should('eq', Cypress.config().baseUrl + '/login');
    // should see error message
    cy.get('.notification')
      .contains('Invalid email or password')
      .should('exist');
    cy.get('nav').contains('Manage').should('not.exist');
  });

  it(`Can't Login with the wrong username`, () => {
    cy.visit(Cypress.env('login_url'));
    emailInput().should('exist');
    passwordInput().should('exist');
    emailInput().type('random' + user.email);
    passwordInput().type(user.password);
    submitBtn().click();
    // should see home page
    cy.url().should('eq', Cypress.config().baseUrl + '/login');
    // should see error message
    cy.get('.notification')
      .contains('Invalid email or password')
      .should('exist');
    cy.get('nav').contains('Manage').should('not.exist');
  });
});

describe('Admin', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
    cy.clearCookies();
  });

  it(`Can Login`, () => {
    cy.visit(Cypress.env('login_url'));
    emailInput().should('exist');
    passwordInput().should('exist');
    emailInput().type(admin.email);
    passwordInput().type(user.password);
    submitBtn().click();
    // should see home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('nav').contains('Manage').should('exist');
  });
});
