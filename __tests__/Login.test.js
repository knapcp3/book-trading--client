import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import Login from '../src/components/Login'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { generateWrapper } from './helpers'

describe('Login Component testing with store', () => {
    let store;
    let actions;
    let mutations;
    let wrapper;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuetify);
        localVue.use(VueRouter);
        localVue.use(Vuex);
    });

    test('submitting a form with input dispatches logIn action with correct username and password', (done) => {
        actions = {
            logIn: jest.fn()
        };

        store = new Vuex.Store({
            state: {},
            actions
        });

        wrapper = generateWrapper(Login, localVue, mount, store);

        wrapper.find('.log-in-form .username-field input').setValue('testun');
        wrapper.find('.log-in-form .password-field input').setValue('testpwd');
        wrapper.find('.log-in-form').trigger('submit.prevent');

        wrapper.vm.$nextTick(() => {
            expect(actions.logIn).toHaveBeenCalled();
            expect(actions.logIn.mock.calls[0][1]).toEqual({
                username: 'testun',
                password: 'testpwd'
            });
            done();
        });
    });

    test('after submitting a form, error while loggin in causes commiting snackbar mutation with correct context and message', (done) => {
        const logInActionMock = jest.fn();
        logInActionMock.mockImplementation(() => {
            throw new Error()
        });

        actions = {
            logIn: logInActionMock
        };

        mutations = {
            activateSnackbar: jest.fn()
        };

        store = new Vuex.Store({
            state: {},
            actions,
            mutations
        });

        wrapper = generateWrapper(Login, localVue, mount, store);

        wrapper.find('.log-in-form').trigger('submit.prevent');

        wrapper.vm.$nextTick(() => {
            expect(mutations.activateSnackbar).toHaveBeenCalled();
            expect(mutations.activateSnackbar.mock.calls[0][1]).toEqual({
                context: 'error',
                message: 'Wrong username or password!'
            });
            done();
        });
    });
});