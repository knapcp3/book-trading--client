import server from '@/axios'

export default {
  state: {
    books: []
  },
  mutations: {
    addBook: (state, payload) => {
      state.books.unshift(payload)
    },
    setBooks: (state, payload) => {
      state.books = payload
    },
    removeBook: (state, { _id }) => {
      state.books = state.books.filter(book => book._id !== _id)
    }
  },
  actions: {
    fetchBooks: async ({ commit }) => {
      try {
        const { data: { books } } = await server.get('/books/all')
        commit('setBooks', books)
      } catch (error) {
        commit('activateSnackbar', {
          message: 'Couldn\'t connect to the server',
          context: 'error',
          timeout: 0
        })
      }
    }
  },
  getters: {
    allBooks: state => state.books,
    userBooks: (state, getters) =>
      state.books.filter(book => book.owner === getters.uid)
  }
}
