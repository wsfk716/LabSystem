<template>
  <div>
    <el-button type="primary" @click="handleAddCollege()">添加学院</el-button>
    <el-table :data="tableData" stripe style="width: 100%" row-key="id">
      <el-table-column prop="name" label="学院名称" width="180" />
      <el-table-column prop="lab_counts" label="下辖场所数" width="180" />
      <el-table-column prop="description" label="简介" width="180" />
      <el-table-column label="操作">
        <template #default="scope" size="large" effect="dark">
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

  <!-- 更新对话框 -->
  <el-dialog v-model="EditDialogVisible" title="修改学院信息" width="35%">
    <el-form
      ref="EditFormRef"
      style="width: 100%"
      :model="EditForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="学院名称" prop="title">
        <el-input v-model="EditForm.name" />
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="EditForm.description" />
      </el-form-item>
      <el-form-item label="下辖场所数" prop="lab_counts">
        <el-input v-model="EditForm.lab_counts" disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加对话框 -->
  <el-dialog v-model="AddDialogVisible" title="添加学院" width="35%">
    <el-form
      ref="AddFormRef"
      style="width: 100%"
      :model="AddForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="学院名称" prop="title">
        <el-input v-model="AddForm.name" />
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="AddForm.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
const tableData = ref([]);
onMounted(() => {
  getList();
});
const getList = async () => {
  // 获取学院列表
  await axios.get("/adminapi/colleges").then((res) => {
    tableData.value = res.data.data;
    // console.log(res.data.data);
  });
};
// 修改相关内容------------------------------------------
const EditDialogVisible = ref(false);
const EditForm = ref({
  name: "",
  description: "",
  lab_counts: 0,
});
const rules = {
  name: [{ required: true, message: "请输入学院名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入学院简介", trigger: "blur" }],
};
const EditFormRef = ref(null);
const currentItem = ref({});
const handleUpdate = (row) => {
  EditDialogVisible.value = true;
  EditForm.value = { ...row };
  currentItem.value = row;
};
const submitEditForm = () => {
  EditFormRef.value.validate(async (valid) => {
    if (valid) {
      // console.log("submit!");
      // console.log(EditForm.value);
      await axios.put(
        `/adminapi/colleges/${currentItem.value.id}`,
        EditForm.value
      );
      EditDialogVisible.value = false;
      getList();
      ElMessage.success("修改成功");
    } else {
      ElMessage.error("请检查输入内容");
      // console.log("error submit!!");
      return false;
    }
  });
};

// 删除相关内容------------------------------------------
const handleDelete = async (row) => {
  await axios.delete(`/adminapi/colleges/${row.id}`);
  getList();
  ElMessage.success("删除成功");
};

// 添加相关内容------------------------------------------
const AddDialogVisible = ref(false);
const AddForm = ref({
  name: "",
  description: "",
});
const AddFormRef = ref(null);
const handleAddCollege = () => {
  AddDialogVisible.value = true;
};
const submitAddForm = () => {
  AddFormRef.value.validate(async (valid) => {
    if (valid) {
      // console.log("submit!");
      // console.log(AddForm.value);
      await axios.post("/adminapi/colleges", AddForm.value);
      AddDialogVisible.value = false;
      getList();
      ElMessage.success("添加成功");
    } else {
      ElMessage.error("请检查输入内容");
      // console.log("error submit!!");
      return false;
    }
  });
};
</script>
<style lang="scss" scoped>
// .el-tag {
//   --el-tag-text-color: white;
// }
</style>
