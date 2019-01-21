import { shallowMount } from '@vue/test-utils'

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
