<template>
  <div class="rightList">
    <el-table :data="tableData" stripe style="width: 100%" row-key="id">
      <el-table-column prop="title" label="权限名称" width="180" />
      <el-table-column label="图标" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon size="22px">
              <component :is="mapIcons[scope.row.icon]"></component>
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" round @click="handleUpdate(scope.row)">
            更新
          </el-button>
          <el-popconfirm
            title="你确定要删除吗？"
            @confirm="handleDelete(scope.row)"
            confirmButtonText="确定"
            cancelButtonText="取消"
            width="160px"
          >
            <template #reference>
              <el-button type="danger" round> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="更新权限"
    width="35%"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      style="width: 100%"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="权限名称" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="submitForm()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import {
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
} from "@element-plus/icons-vue";
const tableData = ref([]);
onMounted(() => {
  getList();
});

const getList = async () => {
  const res = await axios.get("/adminapi/rights");
  console.log(res.data);
  tableData.value = res.data;
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
};
// 更新按钮
const handleUpdate = (item) => {
  ruleForm.value = item;
  currentItem.value = item;
  dialogVisible.value = true;
};
// 删除按钮
const handleDelete = async (item) => {
  // console.log(item);
  await axios.delete(`/adminapi/rights/${item.id}`);
  getList();
};

// 更新对话框
const dialogVisible = ref(false);
const ruleFormRef = ref();
const ruleForm = ref({
  title: "",
});
const currentItem = ref({});

const rules = ref({
  title: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
});

// 提交按钮
const submitForm = async () => {
  // 表单验证
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      // 提交表单数据
      await axios.put(
        `/adminapi/rights/${currentItem.value.id}`,
        ruleForm.value
      );
      dialogVisible.value = false;
      ElMessage.success("提交成功");
      await getList();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 取消按钮
const handleCancel = () => {
  dialogVisible.value = false;
  ruleForm.value = currentItem.value;
  getList();
};
// 关闭图标
const handleClose = () => {
  dialogVisible.value = false;
  ruleForm.value = currentItem.value;
  getList();
};
</script>
<style lang="scss" scoped></style>
