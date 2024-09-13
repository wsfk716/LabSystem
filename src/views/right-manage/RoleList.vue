<template>
  <div>
    <el-button type="primary" @click="handleAddRole">新建角色</el-button>
    <el-table :data="tableData" stripe style="width: 100%" row-key="id">
      <!-- <el-table-column prop="roleName" label="角色名称" width="180" /> -->
      <el-table-column label="角色名称">
        <template #default="scope">
          <el-popover
            placement="right"
            title="权限详情"
            :width="200"
            trigger="hover"
            @before-enter="handlePopoverEnter(scope.row)"
          >
            <template #reference>
              <el-button class="m-2">{{ scope.row.roleName }}</el-button>
            </template>
            <template #default>
              <el-tree
                style="max-width: 600px"
                :data="rightList"
                :props="defaultProps"
                :default-expand-all="true"
                :render-content="renderContent"
              />
            </template>
          </el-popover>
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
  <!-- ---------------------------------更新角色对话框------------------------- -->
  <el-dialog v-model="dialogVisible" title="更新角色" width="35%">
    <el-form
      ref="ruleFormRef"
      style="width: 100%"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" />
      </el-form-item>
      <el-form-item label="角色权限" prop="rights">
        <el-tree
          style="max-width: 600px"
          :data="rightList"
          :props="defaultProps"
          :default-expand-all="true"
          show-checkbox
          node-key="path"
          ref="treeRef"
          check-strictly
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- ---------------------------------新建角色对话框------------------------- -->
  <el-dialog v-model="AddDialogVisible" title="新建角色" width="35%">
    <el-form
      ref="AddFormRef"
      style="width: 100%"
      :model="AddForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="AddForm.roleName" />
      </el-form-item>
      <el-form-item label="角色权限" prop="rights">
        <el-tree
          style="max-width: 600px"
          :data="rightList"
          :props="defaultProps"
          :default-expand-all="true"
          show-checkbox
          node-key="path"
          ref="treeRef"
          check-strictly
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleAddCancel">取消</el-button>
        <el-button type="primary" @click="submitAddForm"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { nextTick } from "vue";

const rightList = ref([]);
const tableData = ref([]);
const currentRights = ref([]);
const defaultProps = {
  children: "children",
  label: "title",
};
onMounted(() => {
  getList();
  getRightList();
});

const getList = async () => {
  const res = await axios.get("adminapi/roles");
  tableData.value = res.data.data;
};

const getRightList = async () => {
  const res = await axios.get("adminapi/rights");
  rightList.value = res.data;
  // console.log(res.data);
};

// 弹出框
const handlePopoverEnter = (row) => {
  currentRights.value = row.rights;
};

// 自定义tree节点 内容的回调函数
const renderContent = (h, { node, data, store }) => {
  return h(
    "span",
    {
      class: `custom-tree-node ${
        currentRights.value.includes(data.path) ? "active" : ""
      }`,
    },
    h("span", null, node.label)
  );
};

// 更新按钮相关的内容-------------------------------------------------------
const ruleFormRef = ref();
const ruleForm = ref({
  roleName: "",
});
const currentItem = ref({});
const dialogVisible = ref(false);
const rules = {
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
};
const treeRef = ref();
// 更新按钮
const handleUpdate = (item) => {
  // console.log(item);
  dialogVisible.value = true;
  ruleForm.value.roleName = item.roleName;
  currentItem.value = item;

  // 设置rights给tree
  // 设置rights给tree
  nextTick(() => {
    if (treeRef.value) {
      try {
        treeRef.value.setCheckedKeys(JSON.parse(item.rights));
      } catch (error) {
        console.error("Error setting checked keys:", error);
      }
    } else {
      console.error("treeRef is not defined");
    }
  });
};

// 更新-----取消按钮
const handleCancel = () => {
  // console.log(currentItem.value.roleName);
  ruleForm.value.roleName = currentItem.value.roleName;
  dialogVisible.value = false;
};

// 更新-----提交按钮
const submitForm = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      // 提交表单数据
      await axios.put(`/adminapi/roles/${currentItem.value.id}`, {
        roleName: ruleForm.value.roleName,
        rights: JSON.stringify(treeRef.value.getCheckedKeys()),
      });
      dialogVisible.value = false;
      ElMessage.success("提交成功");
      await getList();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 删除按钮-----------------------------------------------
const handleDelete = async (item) => {
  await axios.delete(`/adminapi/roles/${item.id}`);
  dialogVisible.value = false;
  await getList();
};

// 新建角色相关的内容-------------------------------------------------------
const AddFormRef = ref();
const AddForm = ref({
  roleName: "",
});
const AddDialogVisible = ref(false);

const handleAddRole = () => {
  AddDialogVisible.value = true;
};

const handleAddCancel = () => {
  AddDialogVisible.value = false;
  AddForm.value.roleName = "";
};

const submitAddForm = async () => {
  await AddFormRef.value.validate(async (valid) => {
    if (valid) {
      // 提交表单数据
      await axios.post(`/adminapi/roles`, {
        roleName: AddForm.value.roleName,
        rights: JSON.stringify(treeRef.value.getCheckedKeys()),
      });
      AddDialogVisible.value = false;
      ElMessage.success("提交成功");
      await getList();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
</script>
<style lang="scss" scoped>
:deep(.active) {
  color: #f56c6c;
}
</style>
