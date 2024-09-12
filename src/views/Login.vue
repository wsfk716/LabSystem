<template>
  <div id="app">
    <vue-particles
      id="tsparticles"
      @particles-loaded="particlesLoaded"
      :options="config"
    />
  </div>
  <div class="formContainer">
    <h1>智慧实验室管理平台</h1>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="ruleForm"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          class="LoginButton"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../store/useUserStore";
import { useRouter } from "vue-router";
import { config } from "../utils/config";
import axios from "axios";
import { ElMessage } from "element-plus";
// 表单对象
const ruleFormRef = ref();
const ruleForm = ref({
  username: "",
  password: "",
});
// 表单验证规则
const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const { user, changeUser } = useUserStore();
const router = useRouter();
// 登录按钮的回调函数
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(ruleForm);
      const res = await axios.post("/adminapi/users/login", ruleForm.value);
      if (res.data.code === 1) {
        ElMessage.success(res.data.message);
        changeUser(res.data.data);
        router.push("/index");
      } else {
        ElMessage.error(res.data.message + "，用户名或密码错误");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 粒子效果
const particlesLoaded = async (container) => {
  // console.log("Particles container loaded", container);
};
</script>
<style lang="scss" scoped>
.formContainer {
  height: 300px;
  width: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 2px 2px 5px black;
  text-align: center;
  z-index: 999;
  h1 {
    text-align: center;
    font-size: 40px;
  }
  :deep(.el-form-item__label) {
    color: white;
    font-size: 16px;
    font-weight: bold;
  }
  .ruleForm {
    margin-top: 50px;
  }
  .LoginButton {
    width: 20%;
    margin-left: 40%;
  }
}
</style>
