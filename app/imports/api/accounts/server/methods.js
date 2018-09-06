import ValidatedMethod from '../../validatedmethod/ValidatedMethod'
import { Cquencial } from '../../cquencial/Cquencial'
import { hasUsers } from '../accountUtils'

export const setupRequired = new ValidatedMethod({
  name: Cquencial.methods.setupRequired.name,
  validate () {},
  run () {
    console.log('has uses ', hasUsers())
    return !hasUsers() // && !hasAdmins() // TODO use Roles
  }
})
