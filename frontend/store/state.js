import Strapi from '../plugins/strapi-sdk'

const State = {
  db: new Strapi('https://mi-salud.herokuapp.com/'),
  notification: undefined,
  token: undefined,
  user: undefined
}

export default State
