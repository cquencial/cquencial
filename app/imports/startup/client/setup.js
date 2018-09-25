import { Routes } from '../../api/routes/Routes'

export const allRoutes = [
  {
    name: 'setup',
    label: 'Setup',
    path: '/',
    template() {
      return import('/imports/ui/pages/setup/setup.js')
    },
    enter: []
  },
]

allRoutes.forEach(route => Routes.define(route.name, route))
