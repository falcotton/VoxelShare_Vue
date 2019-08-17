import Vue from 'vue'
import Router from 'vue-router'
import { AmplifyEventBus } from 'aws-amplify-vue';
import Amplify, * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import AmplifyStore from './store/store';

import aws_exports_gest from "./aws-exports.gest";
import aws_exports from "./aws-exports";




Vue.use(Router)
Vue.use(AmplifyPlugin, AmplifyModules);

let user;

getUser().then((user, ) => {
    if (user) {
        router.push({ path: '/' })
    }
})


AmplifyEventBus.$on('authState', async (state) => {
    if (state === 'signedOut') {
        user = null;
        AmplifyStore.commit('setUser', null);
        router.push({ path: '/' })
    } else if (state === 'signedIn') {
        user = await getUser();
        router.push({ path: '/' })
    }
});

function getUser() {
    return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
        if (data && data.signInUserSession) {
            AmplifyStore.commit('setUser', data);
            return data;
        }
    }).catch(() => {
        AmplifyStore.commit('setUser', null);
        return null
    });
}

const router = new Router({
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/about',
            name: 'About',
            component: () => import('./views/About.vue')
        },
        {
            path: '/model/:modelpath',
            name: 'Model',
            component: () => import('./views/Model.vue')
        }, {
            path: '/profile',
            name: 'Profile',
            component: () => import('./views/Profile.vue'),
            meta: { requiresAuth: true, requiresMutate: true }
        },
        {
            path: '/user/:id',
            name: 'User',
            component: () => import('./views/User.vue')
        },
        {
            path: '/upload',
            name: 'Upload',
            component: () => import('./views/Upload.vue'),
            meta: { requiresAuth: true, requiresMutate: true }
        },
        {
            path: '/modellist',
            name: 'ModelList',
            component: () => import('./views/ModelList.vue'),
            meta: { requiresAuth: true, requiresMutate: true }
        },
        {
            path: '/auth',
            name: 'Authenticator',
            component: () => import('./views/Auth.vue'),
            meta: { requiresAuth: false, requiresMutate: true }
        }
    ]
})

router.beforeResolve(async (to, from, next) => {
    if (to.meta.requiresMutate) {
        Amplify.configure(aws_exports);
    } else {
        console.log("GestMode")
        Amplify.configure(aws_exports_gest);
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        user = await getUser();
        if (!user) {
            return next({
                path: '/auth',
                query: {
                    redirect: to.fullPath,
                }
            });
        }
        return next()
    }
    return next()
})

export default router