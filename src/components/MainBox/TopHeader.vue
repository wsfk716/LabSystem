<template>
  <div class="top-header">
    <div class="left">
      <h3>实验室管理平台</h3>
    </div>
    <div class="right">
      <h3>欢迎您, {{ user.username }}!</h3>
      <el-dropdown>
        <el-col :span="12">
          <div class="demo-basic--circle">
            <div class="block">
              <el-avatar :size="40" :src="circleUrl" />
            </div>
          </div>
        </el-col>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ user.role.roleName }}</el-dropdown-item>
            <el-dropdown-item
              @click="handleUpdateMap"
              v-if="user.username === 'admin'"
              >更新地图</el-dropdown-item
            >
            <el-dropdown-item @click="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="更新地图"
    width="50%"
    :before-close="handleClose"
  >
    <el-upload
      class="upload-demo"
      drag
      action="/adminapi/upload"
      :data="data"
      :on-success="handleSuccess"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">请将文件拖拽至此处 或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>
<script setup>
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "vue-router";
import { useRouterStore } from "@/store/useRouterStore";
import { UploadFilled } from "@element-plus/icons-vue";
import { ref } from "vue";
const circleUrl = "/touxiang.png";
const router = useRouter();
const dialogVisible = ref(false);
const { user, changeUser } = useUserStore();
const { changeRouter } = useRouterStore();
const handleLogOut = () => {
  // 退出登录
  changeUser(null);
  changeRouter(false);
  // 跳转到登录页
  router.push("/login");
};

const handleUpdateMap = () => {
  dialogVisible.value = true;
  // 更新地图
  console.log("更新地图");
};

const handleClose = () => {
  dialogVisible.value = false;
  // console.log("关闭");
};

const data = {
  token: localStorage.getItem("token"),
};

const handleSuccess = () => {
  dialogVisible.value = false;
  window.location.reload();
};
</script>
<style lang="scss" scoped>
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0d47a1;
  color: white;
  .right {
    display: flex;
    align-items: center;
    margin-right: 20px;
    h3 {
      margin-right: 10px;
    }
  }
  .left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
}
</style>
