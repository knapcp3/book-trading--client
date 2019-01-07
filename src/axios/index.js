import axios from 'axios'

let baseURL

baseURL = 'http://localhost:3010'

// baseURL = 'https://book-trading--server.herokuapp.com'

// === 'development'
    // ? baseURL = 'http://localhost:3010'
    // : baseURL = 'https://book-trading--server.herokuapp.com'
  // ? baseURL = 'http://localhost:3000'
  // : baseURL = 'https://book-trading--server.herokuapp.com'

export default axios.create({ baseURL })
