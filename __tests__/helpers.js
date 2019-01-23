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


export const generateWrapper = function(component, localVue, mountWay, store) {
  let mWay, st

  const router = new VueRouter()

  switch (arguments.length) {
    case 2:
      mWay = shallowMount;
    case 3:
      mWay = mountWay;
    case 4:
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
  })
}
