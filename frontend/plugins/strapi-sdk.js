import axios from 'axios'

class Strapi {
  /**
  * A strapi-client instance.
  * @param {string} baseURL The base URL of the API.
  */
  constructor (baseURL) {
    /** @type {string} A valid JSONWebToken. */
    this.token = undefined
    this.request = axios.create({ baseURL })
    this.onRequestError = (error) => error
    
    // Request Interceptor
    this.request.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        
        return config
      },
      error => {
        console.log('[Axios] Request Error:', { error })
        return Promise.reject(error)
      }
    )
      
    // Response Interceptor
    this.request.interceptors.response.use(
      resp => resp.data,
      error => {
        console.log('[Axios] Response Error:', { error })
        this.onRequestError(error)
        return error.response ? error.response.data : {
          error: true,
          statusCode: 0,
          message: error.message
        }
      }
    )
  }

  setToken (token) {
    this.token = token
  }

  setOnRequestError (fn) {
    this.onRequestError = fn
  }
      
  /**
  * Get currently authenticated user.
  * @param {string} [token] - A valid JWT
  * @return {Promise<Object>} User object.
  */
  currentUser (token) {
    if (token) this.token = token
    return this.request.get('/users/me')
    .catch(error => error)
  }
  
  /**
  * Login and generate an authenticated token.
  * @param {string} identifier - A user's identifier
  * @param {string} password - The corresponding password.
  * @return {Promise<Object>} User object and jwt.
  */
  login (identifier, password) {
    return this.request.post('/auth/local', { identifier, password })
    .then(data => {
      this.token = data.jwt
      return data
    })
    .catch(error => error)
  }
  
  /**
  * Register a new user.
  * @param {Object} data - The user data to be registered.
  * @return {Promise<Object>} User object and jwt.
  */
  register (data) {
    return this.request.post('/auth/local/register', data)
    .then(data => {
      this.token = data.jwt
      return data
    })
    .catch(error => error)
  }
  
  // TODO: Forgot password, Reset password
  
  /**
  * Count the data of a content-type.
  * @param {string} contentType The content-type or model to count.
  * @param {Object} [query] The query on what to count.
  * @return {Promise<number>} The number of data counted.
  */
  count (contentType, query) {
    return this.request.get(`/${contentType}/count`, query ? { params: query } : undefined)
    .catch(error => error)
  }
  
  /**
  * Create an entry to the given content-type.
  * @param {string} contentType The content-type or model.
  * @param {Object} data The data to insert.
  * @return {Promise<Object>} An object of the created entry.
  */
  create (contentType, data) {
    return this.request.post(`/${contentType}`, data).catch(error => error)
  }
  
  /**
  * Read an entry or a content-type.
  * @param {string} contentType The content-type or model.
  * @param {Object|number} query Query parameters or the ID of a specific entry.
  * @return {Promise<Array|Object>} Returns an array of entries or an object of a specific entry.
  */
  get (contentType, query) {
    switch (typeof query) {
      case 'object':
      return this.request.get(`/${contentType}`, { params: query }).catch(error => error)
      // break
      case 'number':
      return this.request.get(`/${contentType}/${query}`).catch(error => error)
      // break
      case 'string':
      return this.request.get(`/${contentType}/${Number(query)}`).catch(error => error)
      // break
      case 'undefined':
      return this.request.get(`/${contentType}`).catch(error => error)
      // break
    }
  }
  
  /**
  * Update an entry in a content-type.
  * @param {string} contentType The content-type or model.
  * @param {number} id An entry ID.
  * @param {Object} data The updated data.
  * @return {Promise<Object>} An object of the updated entry.
  */
  update (contentType, id, data) {
    return this.request.put(`/${contentType}/${id}`, data).catch(error => error)
  }
  
  /**
  * Delete an entry.
  * @param {string} contentType The content-type or model.
  * @param {number} id An entry ID.
  * @return {Promise<Object>} An object of the deleted entry.
  */
  delete (contentType, id) {
    return this.request.delete(`/${contentType}/${id}`).catch(error => error)
  }
}

export default Strapi
