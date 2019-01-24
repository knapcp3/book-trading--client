import { shallowMount, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'


export const generateWrapperWithAuth = function(component, localVue, isAuth) {
  return shallowMount(component, {
    localVue,
    sync: false,
    stubs: ['router-link', 'router-view'],
    computed: {
      authenticated: () => {return isAuth}
    }
  })
}

export const generateWrapper = function(component, localVue, mountWay, store, options) {
  let mWay, st
  let op = options || {}

  const router = new VueRouter()

  switch (arguments.length) {
    case 2:
      mWay = shallowMount;
    case 3:
      mWay = mountWay;
    case 4:
    case 5:
      mWay = mountWay;
      st = store;
    default:
  }

  return mWay(component, {
    localVue,
    sync: false,
    router,
    store: st,
    stubs: ['router-link', 'router-view'],
    ...op
  })
}

export const mockThrowError = (msg) => {
  const m = msg || 'error'
  const f = jest.fn()
  f.mockImplementation(() => {
    throw new Error(m)
  })
  return f;
}
