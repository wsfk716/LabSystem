<template>
  <div>
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu
          :default-active="route.fullPath"
          class="el-menu-vertical-demo"
          style="height: 100vh"
          :router="true"
        >
          <template v-for="item in dataList" :key="item.path">
            <el-sub-menu
              :index="item.path"
              v-if="item.children.length && checkAuth(item.path)"
            >
              <template #title>
                <el-icon>
                  <component :is="mapIcons[item.icon]"></component>
                </el-icon>
                <span>{{ item.title }}</span>
              </template>
              <template
                v-for="childItem in item.children"
                :key="childItem.path"
              >
                <el-menu-item
                  :index="childItem.path"
                  v-if="checkAuth(childItem.path)"
                >
                  <el-icon>
                    <component :is="mapIcons[childItem.icon]"></component>
                  </el-icon>
                  {{ childItem.title }}
                </el-menu-item>
              </template>
            </el-sub-menu>
            <el-menu-item
              :index="item.path"
              v-else-if="!item.children.length && checkAuth(item.path)"
            >
              <el-icon>
                <component :is="mapIcons[item.icon]"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
  </div>
</template>
<script setup>
import {
  HomeFilled,
  List,
  Key,
  OfficeBuilding,
  UploadFilled,
  User,
  Menu,
  Avatar,
  CirclePlusFilled,
  Promotion,
  Setting,
  Aim,
} from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { useUserStore } from "../../store/useUserStore";
const { user } = useUserStore();
const route = useRoute();
const dataList = ref();
onMounted(() => {
  getList();
});
const getList = async () => {
  const res = await axios.get("/adminapi/rights");
  dataList.value = res.data;
  // console.log(res.data);
};

// 图标映射
const mapIcons = {
  HomeFilled,
  List,
  Key,
  OfficeBuilding,
  UploadFilled,
  User,
  Avatar,
  Menu,
  CirclePlusFilled,
  Promotion,
  Setting,
  Aim,
};

const checkAuth = (path) => {
  if (user.role.rights.includes(path)) {
    return true;
  }
  return false;
};
</script>
