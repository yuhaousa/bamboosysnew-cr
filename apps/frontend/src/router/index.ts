import { createRouter, createWebHistory } from 'vue-router'
import DynamicPage from '@/views/DynamicPage.vue'
import PreviewPage from '@/views/PreviewPage.vue'
import NotFound from '@/views/NotFound.vue'
import MaintenancePage from '@/views/MaintenancePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/preview/:pageId', component: PreviewPage },
    { path: '/maintenance', component: MaintenancePage },
    { path: '/:slug(.*)*', component: DynamicPage },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

export default router
