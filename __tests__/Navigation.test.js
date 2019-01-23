import { createLocalVue, mount } from '@vue/test-utils'
import Navigation from './../src/components/Navigation'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { generateWrapperWithAuth } from "./helpers"


describe('Navigation Component unit testing', () => {
  let localVue
  let wrapper

  beforeAll(() => {
    localVue = createLocalVue()
    localVue.use(Vuetify)
  })

  test('bookItems() returns 3 elements when user is authenticated', () => {
    wrapper = generateWrapperWithAuth(Navigation, localVue, true)
    const vm = wrapper.vm
    expect(vm.bookItems).toHaveLength(3)
  })

  test('bookItems() returns bookItems with 1 element when user is not authenticated', () => {
    wrapper = generateWrapperWithAuth(Navigation, localVue, false)
    const vm = wrapper.vm
    expect(vm.bookItems).toHaveLength(1)
  })

  test('userItems() returns 2 items when user is not authenticated', () => {
    wrapper = generateWrapperWithAuth(Navigation, localVue, false)
    const vm = wrapper.vm
    expect(vm.userItems).toHaveLength(2)
  })

  test('userItems() returns no items when user is authenticated', () => {
    wrapper = generateWrapperWithAuth(Navigation, localVue, true)
    const vm = wrapper.vm
    expect(vm.userItems).toBeUndefined()
  })
})

describe('Navigation Component testing with store', () => {
  let store
  let mutations
  let wrapper
  let localVue

  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify)
    localVue.use(VueRouter)
    localVue.use(Vuex)
  })

  beforeEach(() => {
    mutations =  {
      setUser: jest.fn(),
      setAuthToken: jest.fn()
    }

    store = new Vuex.Store({
      state: {},
      mutations
    })

    const router = new VueRouter()

    wrapper = mount(Navigation, {
      localVue,
      router,
      store,
      sync: false,
      stubs: ['router-link', 'router-view'],
      computed: {
        authenticated: () => {return true;}
      }
    })
  })

  test('logOut button click commits setUser mutation with username and id equal to null', () => {
    wrapper.find('.log-out-btn').trigger('click')

    expect(mutations.setUser).toHaveBeenCalled()
    expect(mutations.setUser.mock.calls[0][1])
      .toEqual({ username: null, _id: null })
  })

  test('logOut button click commits setAuthToken mutation with token equal to null', () => {
    wrapper.find('.log-out-btn').trigger('click')

    expect(mutations.setAuthToken).toHaveBeenCalled()
    expect(mutations.setAuthToken.mock.calls[0][1])
      .toEqual(null)
  })

})
