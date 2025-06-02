describe('PlantRecognizer Component with login', () => {
  beforeEach(() => {
    // Obišče login stran
    cy.visit('/login');

    // Izpolni obrazec
    cy.get('input[type="email"]').type('mare@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();


    // Počaka na preusmeritev po uspešni prijavi
    cy.contains('Tvoj').should('be.visible');


    cy.visit('/dashboard/plantRecognition');
  });

  it('naloži in prikaže izbrano sliko', () => {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/Aloe-vera_3.jpg', { force: true });

    
  });

  it('pošlje sliko in prikaže rezultat', () => {
    cy.intercept('POST', 'http://localhost:5000/identify', {
      fixture: 'identify_response.json',
    }).as('identifyRequest');

    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/Aloe-vera_3.jpg', { force: true });

    cy.get('button')
    .contains('Prepoznaj')
    .click({ force: true });

    cy.wait('@identifyRequest', {timeout: 20000});

    cy.contains('🌿 Najverjetnejša rastlina').should('exist');
    cy.contains('Verjetnost:').should('exist');
    cy.contains('💾 Shrani med moje rastline').should('exist');
  });

});
