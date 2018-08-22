
const concat = x => `commonErrors.${x}`

export const CommonErrors = {
  permissionDenied () {
    return [concat(this.name), 'commonErrors.permissionDeniedDescription']
  }
}

CommonErrors.def = [
  'permissionDenied'
]

CommonErrors.def.forEach(key => {
  CommonErrors[key] = function (reason) {
    const args = [concat(key), concat(key + 'Description')]
    if (reason) args.push(reason)
    return args
  }
})
