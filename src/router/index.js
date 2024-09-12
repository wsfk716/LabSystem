import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import MainBox from "../views/MainBox.vue";
import routerConfig from "./config";
import { useRouterStore } from "../store/useRouterStore";
import NotFound from "../views/notfound/NotFound.vue";
import { useUserStore } from "../store/useUserStore";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const routes = [
  // 路由配置
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/mainbox",
    name: "mainbox",
    component: MainBox,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach((to, from) => {
  // 关闭进度提示
  NProgress.done();
});

// 路由拦截
router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start();

  const { user } = useUserStore();
  const { isGetterRouter, changeRouter } = useRouterStore();
  if (to.path === "/login") {
    next();
  } else {
    // 判断是否登录，主要就是判断本地内存中是否有token
    if (user.role) {
      // 如果是第一次进入，需要动态添加路由
      if (!isGetterRouter) {
        // 先删除所有的路由
        router.removeRoute("mainbox");
        ConfigRouter();
        changeRouter(true);
        next({ path: to.fullPath });
      } else {
        next();
      }
    } else {
      next("/login");
    }
  }
});

const ConfigRouter = () => {
  // 创建mainbox的路由
  router.addRoute({
    path: "/mainbox",
    name: "mainbox",
    component: MainBox,
  });
  routerConfig.forEach((item) => {
    checkPermission(item.path) && router.addRoute("mainbox", item);
  });

  // 重定向
  router.addRoute({ path: "/", redirect: "/index" });
  // 404 没有匹配到路由的时候
  router.addRoute("mainbox", {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  });

  // 打印路由的个数
  console.log(router.getRoutes());
};

const checkPermission = (path) => {
  const { user } = useUserStore();
  // 如果包含在权限列表中，就返回true
  return user.role.rights.includes(path);
};
export default router;
