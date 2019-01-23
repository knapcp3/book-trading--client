import { mount, createLocalVue } from '@vue/test-utils'
import MyBooks from './../src/components/MyBooks'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { bookMock, booksMock } from './mocks'
import { generateWrapper } from './helpers'

describe('MyBooks Component', () => {
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

  test('removeBook() does nothing when removeEnabled property returns false', (done) => {
    actions = {
      removeBook: jest.fn()
    }

    storeMock = new Vuex.Store({
      state: {},
      actions
    })

    const computed = {
      removeEnabled: () => false,
      books: () => booksMock
    }

    wrapper = generateWrapper(MyBooks, localVue, mount, storeMock, { computed })

    wrapper.vm.removeBook(bookMock)

    wrapper.vm.$nextTick(() => {
      expect(actions.removeBook).toHaveBeenCalledTimes(0)
      done()
    })
  })

  // test('removeBook() dispatches removeBook action when removeEnabled property returns true', () => {
  //   actions = {
  //     removeBook: jest.fn()
  //   }

  //   storeMock = new Vuex.Store({
  //     state: {},
  //     actions
  //   })

  //   const computed = {
  //     removeEnabled: () => true,
  //     books: () => booksMock
  //   }

  //   wrapper = generateWrapper(MyBooks, localVue, mount, storeMock, { computed })

  //   wrapper.vm.removeBook(bookMock)

  //   wrapper.vm.$nextTick(() => {
  //     expect(actions.removeBook).toHaveBeenCalledTimes(0)
  //     done()
  //   })
  // })
})
