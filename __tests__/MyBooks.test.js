import { mount, createLocalVue } from '@vue/test-utils'
import MyBooks from './../src/components/MyBooks'
import Vuetify from 'vuetify'
import store from './../src/store'
import { RouterLinkStub } from '@vue/test-utils';
// import Vue from 'vue'

describe('MyBooks Component', () => {
  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuetify)

    wrapper = mount(MyBooks, {
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      },
      store
    })
  })

  test('super test', () => {
    expect(true).toBeTruthy
  })
})
