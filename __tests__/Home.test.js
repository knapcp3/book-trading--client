import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import Home from './../src/components/Home'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { bookMock, booksMock } from './mocks'
import { generateWrapper } from './helpers'

describe('Home Component testing', () => {
  let wrapper
  let storeMock
  let actions
  let mutations
  let localVue

  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify)
    localVue.use(VueRouter)
    localVue.use(Vuex)
  })

  test('filteredBooks() filters books depending on the home input field value', () => {
    storeMock = new Vuex.Store({
      state: {}
    })
    const computed = {
      books: () => booksMock
    }
    wrapper = generateWrapper(Home, localVue, mount, storeMock, { computed })

    wrapper.find('.home-search-field input').setValue('www')

    expect(wrapper.vm.filteredBooks).toHaveLength(1)
    expect(wrapper.vm.filteredBooks[0]).toMatchObject({title: 'WWW: Watch'})
  })

  test('send request button click dispatches makeRequest action', (done) => {
    actions = {
      makeRequest: jest.fn()
    }

    storeMock = new Vuex.Store({
      state: {},
      actions,
    })

    wrapper = generateWrapper(Home, localVue, mount, storeMock)

    wrapper.setData({
      pickedBook: bookMock
    })

    wrapper.vm.$nextTick(() => {
      wrapper.find('.send-req-btn').trigger('click')
      wrapper.vm.$nextTick(() => {
        expect(actions.makeRequest).toHaveBeenCalled()
        done()
      })
    })
  })

  test('send request button click commits snackbar mutation with error message wher error occurs', (done) => {
    const f = jest.fn()
    f.mockImplementation(() => {
      throw { response: { data: {message: 'whateva' } } }
    })

    actions = {
      makeRequest: f
    }

    mutations = {
      activateSnackbar: jest.fn()
    }

    storeMock = new Vuex.Store({
      state: {},
      actions,
      mutations
    })

    wrapper = generateWrapper(Home, localVue, mount, storeMock)

    wrapper.setData({
      pickedBook: bookMock
    })

    wrapper.vm.$nextTick(() => {
      wrapper.find('.send-req-btn').trigger('click')
      wrapper.vm.$nextTick(() => {
        expect(mutations.activateSnackbar).toHaveBeenCalled()
        expect(mutations.activateSnackbar.mock.calls[0][1])
          .toEqual({
            context: 'error',
            message: 'whateva'
          })
        done()
      })
    })
  })

  test('book img click commits snackbar mutation with error message when authenticated() return false', () => {
    mutations = {
      activateSnackbar: jest.fn()
    }

    const computed = {
      authenticated: () => false,
      filteredBooks: () => booksMock
    }

    storeMock = new Vuex.Store({
      state: {},
      mutations
    })

    wrapper = generateWrapper(Home, localVue, shallowMount, storeMock, { computed })

    wrapper.find('.book-img').trigger('click')

    expect(mutations.activateSnackbar).toHaveBeenCalled()
    expect(mutations.activateSnackbar.mock.calls[0][1])
      .toEqual({
        message: 'You must be logged in.',
        context: 'error'
      })
  })
})
