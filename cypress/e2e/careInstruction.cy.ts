describe('PlantCareBubble prikaz na areas page', () => {
     beforeEach(() => {
    // Obišče login stran
    cy.visit('/login', {
        onBeforeLoad(win) {
        win.localStorage.setItem('seen_tutorial', 'true');
        }
     });

    // Izpolni obrazec
    cy.get('input[type="email"]').type('mare@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();


    // Počaka na preusmeritev po uspešni prijavi
    cy.contains('Tvoj').should('be.visible');
    
  });

  it('prikaže PlantCareBubble ob kliku na gumb z imenom rastline', () => {
    cy.visit('/dashboard/areas');
    cy.contains('button', 'View').click();
    cy.contains('button', 'Edit Mode').click();
    cy.contains('button', 'Add Plants').click();
    // Poišči gumb z imenom rastline in klikni
    cy.contains('button', 'golden pothos').click();

    // Po kliku preveri, da se prikaže PlantCareBubble
    // Ki ima v sebi nek element z razredom oz. tekstom iz sporočila.
    // Ker si nižji nivo CSS, lahko samo preverimo tekst

    cy.get('div')
      .contains('golden pothos') // ali kakršno koli sporočilo, ki se pojavi
      .should('be.visible');

    // Lahko dodatno preveriš, da je div z razredi, ki jih ima tvoj bubble
    cy.get('div')
      .filter('.bg-green-100') // tvoj bubble container ima ta tailwind razred
      .should('exist')
      .and('be.visible');
  });
});
