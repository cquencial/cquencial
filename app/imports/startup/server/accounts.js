import { Meteor } from 'meteor/meteor'

Meteor.startup(() => {
  if (!Meteor.users.findOne()) {
    // activate register shell
    import readlineSync from 'readline-sync'

    // Wait for user's response.
    const username = readlineSync.question('Please enter a username for the admin (default=admin):') || 'admin'
    const email = readlineSync.question('Please enter an email for the admin (default=admin@example.com):') || 'admin@example.com'
    let password
    let confirmPassword

    do {
      password = readlineSync.question('Please enter your password', {
        hideEchoBack: true
      })
      confirmPassword = readlineSync.question('Please confirm your password', {
        hideEchoBack: true
      })
    } while (password !== confirmPassword)

    const userId = Accounts.createUser({username, email, password})
    console.log(`Created a new admin [${username}] - [${email}] and userId [${userId}]`)
  }
})
