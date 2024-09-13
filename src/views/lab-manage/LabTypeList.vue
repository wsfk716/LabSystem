<template>
  <el-button type="primary" @click="addLabType()"> 添加类型 </el-button>
  <el-table :data="tableData" stripe style="width: 100%" row-key="id">
    <el-table-column prop="name" label="类型名称" width="180" />
    <el-table-column prop="description" label="简介" width="720" />
    <el-table-column label="操作">
      <template #default="scope" size="large" effect="dark">
        <el-button type="primary" round @click="handleEdit(scope.row)">
          编辑
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

  <!-- 编辑对话框 -->
  <el-dialog v-model="EditDialogVisible" title="修改实验室类型" width="30%">
    <el-form
      ref="EditFormRef"
      style="max-width: 600px"
      :model="EditForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="EditForm.name" />
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="EditForm.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加对话框 -->
  <el-dialog v-model="AddDialogVisible" title="添加实验室类型" width="30%">
    <el-form
      ref="AddFormRef"
      style="max-width: 600px"
      :model="AddForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="AddForm.name" />
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="AddForm.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddConfirm()"> 确定 </el-button>
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
  await axios.get("/adminapi/labType").then((res) => {
    tableData.value = res.data.data;
  });
};
// 编辑对话框相关的内容
const EditDialogVisible = ref(false);
const EditFormRef = ref(null);
const EditForm = ref({
  name: "",
  description: "",
});
const currentItem = ref({});
const rules = {
  name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入简介", trigger: "blur" }],
};
const handleEdit = (row) => {
  EditDialogVisible.value = true;
  currentItem.value = row;
  EditForm.value = { ...row };
  // console.log(row);
};

const handleDelete = (row) => {
  // console.log(row);
  axios.delete(`/adminapi/labType/${row.id}`).then(() => {
    ElMessage.success("删除成功");
    getList();
  });
};

const handleConfirm = () => {
  EditFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log(EditForm.value);
      await axios.put(`/adminapi/labType/${currentItem.value.id}`, {
        name: EditForm.value.name,
        description: EditForm.value.description,
      });
      EditDialogVisible.value = false;
      ElMessage.success("修改成功");
      getList();
    } else {
      ElMessage.error("修改失败，请检查输入");
      EditDialogVisible.value = false;
      return false;
    }
  });
};

// 添加类型相关内容
const AddDialogVisible = ref(false);
const AddFormRef = ref(null);
const AddForm = ref({
  name: "",
  description: "",
});
const addLabType = () => {
  AddDialogVisible.value = true;
};
const handleAddConfirm = () => {
  AddFormRef.value.validate(async (valid) => {
    if (valid) {
      // console.log(AddForm.value);
      await axios.post(`/adminapi/labType`, {
        name: AddForm.value.name,
        description: AddForm.value.description,
      });
      AddDialogVisible.value = false;
      ElMessage.success("添加成功");
      getList();
    } else {
      ElMessage.error("添加失败，请检查输入");
      AddDialogVisible.value = false;
      return false;
    }
  });
};
</script>
