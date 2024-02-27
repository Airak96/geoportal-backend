import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store';

import NotFoundView  from '../views/NotFound.vue'

// Layouts
import HomeLayout  from '../layouts/HomeLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

// Views
import LoginView from '../views/auth/LoginView.vue'
import SignUpView from '../views/auth/SignUpView.vue'
import HomeView from '../views/HomeView.vue'
import CategoryListView from '../views/categories/ListView.vue'
import UsersView from '../views/users/UsersView.vue'
import VisitsView from '../views/visits/VisitsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // linkActiveClass: 'border-blue-500 text-gray-900',
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
      path: '/signup',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: SignUpView,
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          component: CategoryListView
        },
        {
          path: 'users',
          component: UsersView
        },
        {
          path: 'visitors',
          component: VisitsView
        }
      ],
    },
    { path: "/:pathMatch(.*)*", component: NotFoundView },
  ]
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/','/login','/signup'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return '/login';
  }

  if(authRequired && auth?.user?.data?.role == 'visitor') {
    return '/';
  }
});

export default router
