import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import AddBook from './../src/components/AddBook'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { generateWrapper, mockThrowError } from './helpers'
import { pickedBookMock } from './mocks'

describe('AddBook Component testing', () => {
  let storeMock
  let actions
  let mutations
  let wrapper
  let localVue

  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify)
    localVue.use(VueRouter)
    localVue.use(Vuex)
  })

  test('saveBook() dispatches saveBook action with pickedBook and commits snackbar with success message when no error', (done) => {
    actions = {
      saveBook: jest.fn()
    }

    mutations = {
      activateSnackbar: jest.fn()
    }

    storeMock = new Vuex.Store({
      state: {},
      actions,
      mutations
    })

    wrapper = generateWrapper(AddBook, localVue, mount, storeMock)

    wrapper.setData({
      pickedBook: pickedBookMock
    })

    wrapper.vm.saveBook()

    wrapper.vm.$nextTick(() => {
      expect(actions.saveBook).toHaveBeenCalled()
      expect(actions.saveBook.mock.calls[0][1])
        .toEqual(pickedBookMock.info.volumeInfo)
      wrapper.vm.$nextTick(() => {
        expect(mutations.activateSnackbar).toHaveBeenCalled()
        expect(mutations.activateSnackbar.mock.calls[0][1])
        .toEqual({
          message: 'Book was added to your collection',
          context: 'success'
        })
        done()
      })
    })
  })

  test('saveBook() commits snackbar with error message error occurs', (done) => {
    actions = {
      saveBook: mockThrowError()
    }

    mutations = {
      activateSnackbar: jest.fn()
    }

    storeMock = new Vuex.Store({
      state: {},
      actions,
      mutations
    })

    wrapper = generateWrapper(AddBook, localVue, mount, storeMock)

    wrapper.setData({
      pickedBook: pickedBookMock
    })

    wrapper.vm.saveBook()

    wrapper.vm.$nextTick(() => {
      expect(mutations.activateSnackbar).toHaveBeenCalled()
      expect(mutations.activateSnackbar.mock.calls[0][1])
      .toEqual({
        message: 'Unable to save book.',
        context: 'error'
      })
      done()
    })

  })
})


