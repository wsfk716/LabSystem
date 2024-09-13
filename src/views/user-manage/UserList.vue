<template>
  <div>
    <el-button type="primary" @click="handleAddUser">添加用户</el-button>
    <el-table :data="tableData" stripe style="width: 100%" row-key="id">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column label="角色名称">
        <template #default="scope">
          <div>{{ scope.row.role.roleName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            round
            @click="handleUpdate(scope.row)"
            :disabled="scope.row.is_default ? true : false"
          >
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
              <el-button
                type="danger"
                round
                :disabled="scope.row.is_default ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 更新对话框 -->
  <el-dialog v-model="dialogVisible" title="更新用户" width="35%">
    <el-form
      ref="ruleFormRef"
      style="width: 100%"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select
          v-model="ruleForm.roleId"
          placeholder="请选择角色"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in RoleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加对话框 -->
  <el-dialog v-model="addDialogVisible" title="添加用户" width="35%">
    <el-form
      ref="addFormRef"
      style="width: 100%"
      :model="addForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select
          v-model="addForm.roleId"
          placeholder="请选择角色"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in RoleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmitForm"> 确定 </el-button>
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
  getRoleList();
});

const getList = async () => {
  const res = await axios.get("/adminapi/users");
  // console.log(res.data);
  tableData.value = res.data.data;
  // console.log(tableData.value);
};

// 获取角色列表
const RoleList = ref([]);
const getRoleList = async () => {
  const res = await axios.get("/adminapi/roles");
  RoleList.value = res.data.data;
  // console.log(RoleList.value);
};

// 更新按钮中，对话框相关的内容

const dialogVisible = ref(false);
const ruleForm = ref({
  username: "",
  password: "",
  roleId: "",
});
const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  roleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
});
const currentItem = ref({});
const ruleFormRef = ref();
const handleUpdate = async (item) => {
  // console.log(item);
  dialogVisible.value = true;
  // 获取当前用户的信息
  ruleForm.value.username = item.username;
  ruleForm.value.password = item.password;
  ruleForm.value.roleId = item.roleId;
  currentItem.value = item;
};
// 删除按钮
const handleDelete = async (item) => {
  // console.log(item);
  await axios.delete(`/adminapi/users/${item.id}`);
  getList();
};

// 取消按钮
const handleCancel = () => {
  dialogVisible.value = false;
};

// 提交按钮
const submitForm = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (currentItem.value.id) {
        // 更新
        await axios.put(
          `/adminapi/users/${currentItem.value.id}`,
          ruleForm.value
        );
      }
      getList();
      dialogVisible.value = false;
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 添加用户按钮，对话框相关的内容
const addDialogVisible = ref(false);
const addForm = ref({
  username: "",
  password: "",
  roleId: "",
});
const addFormRef = ref();
const handleAddUser = () => {
  addDialogVisible.value = true;
};

const addSubmitForm = async () => {
  await addFormRef.value.validate(async (valid) => {
    if (valid) {
      // 提交表单数据
      await axios.post("/adminapi/users", addForm.value);
      addDialogVisible.value = false;
      ElMessage.success("提交成功");
      await getList();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
</script>
