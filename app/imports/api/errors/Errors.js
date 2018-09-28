const concat = x => `commonErrors.${x}`

export const CommonErrors = {
  permissionDenied (details) {
    return [concat(this.name), concat(this.name + 'Description'), details]
  },
  internalServerError (details) {
    return [concat(this.name), concat(this.name + 'Description'), details]
  }
}

CommonErrors.def = [
  'permissionDenied',
  'internalServerError'
]

CommonErrors.def.forEach(key => {
  CommonErrors[key] = function (reason) {
    const args = [concat(key), concat(key + 'Description')]
    if (reason) args.push(reason)
    return args
  }
})
