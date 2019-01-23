import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import Signup from './../src/components/Signup'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { generateWrapper, mockThrowError } from './helpers'

describe('Signup Component unit testing', () => {
  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuetify)

    wrapper = mount(Signup, {
      localVue,
      sync: false
    })
  })

  test(`pickErrorMessage() picks 'username already exists' error text when data code === 11000`, () => {
    const vm = wrapper.vm

    const result = vm.pickErrorMessage({response: {
      data: {
        code: 11000
      }
    }})
    expect(result).toContain("This username already exists")
  })

  test('pickErrorMessage() picks general error text when data code !== 11000', () => {
    const vm = wrapper.vm

    const result = vm.pickErrorMessage({response: {
      data: {
        code: 666
      }
    }})
    expect(result).toContain("Something went wrong")
  })
})

describe('Singup Component testing with store', () => {
  let store
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

  test('submitting a form with input dispatches signUp action with correct username and password', (done) => {
    actions = {
      signUp: jest.fn()
    }

    store = new Vuex.Store({
      state: {},
      actions
    })

    wrapper = generateWrapper(Signup, localVue, mount, store)

    wrapper.find('.sign-up-form .username-field input').setValue('alice')
    wrapper.find('.sign-up-form .password-field input').setValue('alicepassword')
    wrapper.find('.sign-up-form').trigger('submit.prevent')

    wrapper.vm.$nextTick(() => {
      expect(actions.signUp).toHaveBeenCalled()
      expect(actions.signUp.mock.calls[0][1])
      .toEqual({ username: 'alice', password: 'alicepassword' })
      done()
    })
  })

  test('after submitting a form, error while signing up causes commiting snackbar mutation wth correct context and message', (done) => {
    actions = {
      signUp: mockThrowError()
    }

    mutations = {
      activateSnackbar: jest.fn()
    }

    store = new Vuex.Store({
      state: {},
      actions,
      mutations
    })

    wrapper = generateWrapper(Signup, localVue, mount, store)

    wrapper.find('.sign-up-form').trigger('submit.prevent')

    wrapper.vm.$nextTick(() => {
      expect(mutations.activateSnackbar).toHaveBeenCalled()
      expect(mutations.activateSnackbar.mock.calls[0][1])
      .toEqual({ context: 'error', message: 'Something went wrong.' })
      done()
    })
  })
})
