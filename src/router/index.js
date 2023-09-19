import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store';

import NotFoundView  from '../views/NotFound.vue'

// Layouts
import HomeLayout  from '../layouts/HomeLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

// Views
import LoginView from '../views/auth/LoginView.vue'

import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'

import LayersListView from '../views/layers/ListView.vue'
import LayersEditView from '../views/layers/EditView.vue'

import CategoryListView from '../views/categories/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'border-indigo-500 text-gray-900',
  routes: [
    {
      path: '/',
      component: HomeLayout,
      children: [
        {
          path: '',
          component: HomeView
        },
      ],
    },
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: LoginView,
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          component: MainView,
        },
        {
          path: 'capas',
          component: LayersListView,
          meta: { transition: 'slide-left' },
        },
        {
          path: 'capas/editar',
          component: LayersEditView,
          meta: { transition: 'slide-left' },
        },
        {
          path: 'categorias',
          component: CategoryListView
        },
      ],
    },
    { path: "/:pathMatch(.*)*", component: NotFoundView },
  ]
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/','/login'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return '/login';
  }
});

export default router
