describe('Blog app', function() {
  const user = {
    name: 'Enmanuel Urena',
    username: 'enmanuelurena',
    password: 'DevPassword'
  }
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function(){
      cy.get('input[name=username]').type(user.username)
      cy.get('input[name=password]').type(user.password)
      cy.contains('login').click()
      cy.contains('blogs')
    })

    it('fails with wrong credentials', function(){
      cy.get('input[name=username]').type('UserNotExists')
      cy.get('input[name=password]').type('WrongPassword')
      cy.contains('login').click()
      cy.get('.error')
        .should('contain', 'user or password invalid')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function(){
      cy.login({ username: user.username, password: user.password })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('input[name=title]').type('A blog created by cypress')
      cy.get('input[name=author]').type('Cypress')
      cy.get('input[name=url]').type('N/A')
      cy.get('[data-test-id="submitButton"]').click()

      cy.contains('A blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'A blog created by cypress #1',
          author: 'Cypress',
          url: 'N/A'
        })
        cy.createBlog({
          title: 'A blog created by cypress #2',
          author: 'Cypress',
          url: 'N/A'
        })
      })

      it('it can be liked', function () {
        cy.contains('A blog created by cypress #1').contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('it can be deleted', function() {
        cy.contains('A blog created by cypress #1').contains('view').click()
        cy.contains('remove').click()
        cy.get('[data-test-id="main"]')
          .should('not.contain','A blog created by cypress #1')
          .and('contain','A blog created by cypress #2')
      })

      it('only the creator can see the delete button', function() {
        const newUser = {
          name: 'Dev',
          username: 'devuser',
          password: 'DevPassword'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, newUser)
        cy.contains('A blog created by cypress #1').contains('view').click()
        cy.get('.blog-container:first')
          .should('contain', 'remove')
        cy.contains('logout').click()
        cy.login({ username: newUser.username, password: newUser.password })
        cy.contains('A blog created by cypress #1').contains('view').click()
        cy.get('.blog-container:first')
          .should('not.contain', 'remove')
      })

      it('blogs are ordered by likes', function() {
        cy.contains('A blog created by cypress #2').contains('view').click()
        cy.contains('like').click().click()
        cy.get('.blog-container:first')
          .should('contain', 'A blog created by cypress #2')
      })
    })
  })
})