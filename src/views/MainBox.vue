<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-aside width="200px">
        <SideMenu></SideMenu>
      </el-aside>
      <el-container>
        <el-header>
          <TopHeader></TopHeader>
        </el-header>
        <el-main>
          <el-scrollbar>
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import TopHeader from "../components/MainBox/TopHeader.vue";
import SideMenu from "../components/MainBox/SideMenu.vue";
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
}
</style>
