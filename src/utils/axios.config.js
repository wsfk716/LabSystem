import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";

let loading;
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 如果有 token，就加到请求头中
    const token = localStorage.getItem("token");
    config.headers.token = token;
    loading = ElLoading.service({ fullscreen: true });
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 如果有 token，就存储到 localStorage 中
    const res = response.data;
    res?.data?.token && localStorage.setItem("token", res?.data?.token);
    loading && loading.close();
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    loading && loading.close();
    if (error.response.status === 401) {
      ElMessage.error("登录状态失效，请重新登录");
      // 如果是 401 错误，就清除 token
      localStorage.removeItem("token");
      // 跳转到登录页
      window.location.href = "#/login";
    }
    return Promise.reject(error);
  }
);
