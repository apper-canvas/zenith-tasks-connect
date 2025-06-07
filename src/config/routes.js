import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
    icon: 'Square',
    component: Home,
    path: '/'
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    icon: 'AlertTriangle',
    component: NotFound,
    path: '*'
  }
}

export const routeArray = Object.values(routes)