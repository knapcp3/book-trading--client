<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
        <v-text-field
          label="Search for a book"
          prepend-icon="search"
          solo
          autofocus
          v-model="searchKeyword"
          @keydown="getBooks"
        ></v-text-field>
        <v-progress-linear v-if="loading" height="2" class="mt-0 mb-0" indeterminate></v-progress-linear>
      </v-flex>
    </v-layout>
    <v-layout row v-if="books.length > 0">
      <v-flex sm6 offset-sm3>
        <v-list>
          <v-list-tile
            @click="pickBook(i)"
            v-for="(book, i) in books"
            :key="book.title"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ book.volumeInfo.title }}</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unknown' }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon class="white--text">add_circle</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent width="500px">
        <v-card v-if="pickedBook.info">
          <v-card-title class="headline primary--text">Add book</v-card-title>
          <v-card-text>Add "{{ pickedBook.info.volumeInfo.title }}" to your collection?</v-card-text>
          <v-card-actions>
            <v-btn class="green--text darken-1" :loading="saveInProgress" flat="flat" @click.native="saveBook">Yes</v-btn>
            <v-btn class="red--text darken-1" flat="flat" @click.native="dialog = false">No</v-btn>
          </v-card-actions>         
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import { debounce } from 'lodash'

import { searchBooks } from '@/services/bookApi'
import authStateWatcher from '@/mixins/authStateWatcher'

export default {
  data () {
    return {
      searchKeyword: '',
      books: [],
      dialog: false,
      pickedBook: {
        info: null,
        index: null
      },
      loading: false,
      saveInProgress: false
    }
  },
  methods: {
    getBooks: debounce(async function () {
      try {
        if (this.searchKeyword.length > 2) {
          this.loading = true
          this.books = await searchBooks(this.searchKeyword)
          this.loading = false
        }
      } catch (error) {
        this.$store.commit('activateSnackbar', {
          message: 'Error connecting to book API',
          context: 'error'
        })
      }
    }, 500),
    pickBook (i) {
      this.pickedBook = { info: this.books[i], index: i }
      this.dialog = true
    },
    async saveBook () {
      try {
        this.saveInProgress = true
        const pickedBook = this.pickedBook.info.volumeInfo

        await this.$store.dispatch('saveBook', pickedBook)

        this.books.splice(this.pickedBook.index, 1)

        this.saveInProgress = false
        this.dialog = false
        this.$store.commit('activateSnackbar', {
          message: 'Book was added to your collection',
          context: 'success'
        })
      } catch (error) {
        this.saveInProgress = false
        this.dialog = false
        this.$store.commit('activateSnackbar', {
          message: 'Unable to save book.',
          context: 'error'
        })
      }
    }
  },
  mixins: [authStateWatcher]
}
</script>
