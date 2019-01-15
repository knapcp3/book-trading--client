import { mount, createLocalVue } from '@vue/test-utils'
import Signup from './../src/components/Signup'
import Vuetify from 'vuetify'
// import Vue from 'vue'

describe('Signup Component', () => {
  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuetify)

    wrapper = mount(Signup, {
      localVue,
      sync: false
    })
  })

  test(`Picks 'username already exists' error text when data code === 11000`, () => {
    const vm = wrapper.vm

    const result = vm.pickErrorMessage({response: {
      data: {
        code: 11000
      }
    }})
    expect(result).toContain("This username already exists")
  })

  test('Picks general error text when data code !== 11000', () => {
    const vm = wrapper.vm

    const result = vm.pickErrorMessage({response: {
      data: {
        code: 666
      }
    }})
    expect(result).toContain("Something went wrong")
  })
})
