<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%" row-key="id">
      <el-table-column label="名称">
        <template #default="scope">
          <el-link @click="handleLocation(scope.row)">{{
            scope.row.title
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="所属学院">
        <template #default="scope">
          <el-tag>{{ college_method(scope.row.college_type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="实验室类型">
        <template #default="scope" size="large" effect="dark">
          <el-tag type="success">{{ lab_method(scope.row.lab_type) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="capacity" label="容纳人数" width="180" />
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
  <el-dialog v-model="dialogVisible" title="更新用户" width="35%">
    <el-form
      ref="ruleFormRef"
      style="width: 100%"
      :model="updateForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="实验室名称" prop="title">
        <el-input v-model="updateForm.title" />
      </el-form-item>
      <el-form-item label="容纳人数" prop="capacity">
        <el-input v-model="updateForm.capacity" />
      </el-form-item>
      <el-form-item label="实验室类型" prop="lab_type">
        <el-select
          v-model="updateForm.lab_type"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in LabTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属院系" prop="college_type">
        <el-select
          v-model="updateForm.college_type"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 预览实验室弹出框 -->
  <el-dialog
    v-model="preDialogVisible"
    title="预览实验室"
    :fullscreen="true"
    v-if="preDialogVisible"
  >
    <LabMap
      :x="currentItem.x"
      :y="currentItem.y"
      :t="currentItem.title"
    ></LabMap>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { collegeList } from "../../utils/type";
import LabMap from "../../components/lab-manage/LabMap.vue";
const tableData = ref([]);
onMounted(() => {
  getLabTypeList();
  getList();
});
const getList = async () => {
  // 获取实验室列表
  await axios.get("/adminapi/labs").then((res) => {
    tableData.value = res.data.data;
    // console.log(res.data.data);
  });
};

const LabTypeList = ref([]);
const getLabTypeList = async () => {
  await axios.get("/adminapi/labType").then((res) => {
    LabTypeList.value = res.data.data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    // console.log(LabTypeList.value);
  });
};

const college_method = (value) => {
  const res = collegeList.find((item) => item.value === value);

  return res.label;
};
const lab_method = (value) => {
  const res = LabTypeList.value;
  const result = res.find((item) => item.value === value);
  return result.label;
};

// 更新实验室
const handleUpdate = (item) => {
  // console.log(item);
  dialogVisible.value = true;
  updateForm.value = { ...item };
  currentItem.value = item;
};
// 删除实验室
const handleDelete = (item) => {
  axios.delete(`/adminapi/labs/${item.id}`).then((res) => {
    getList();
  });
};

const dialogVisible = ref(false);
const updateForm = ref({
  title: "",
  capacity: "",
  lab_type: "",
  college_type: "",
});
const currentItem = ref({});
const rules = ref({
  title: [{ required: true, message: "请输入实验室名称", trigger: "blur" }],
  capacity: [{ required: true, message: "请输入容纳人数", trigger: "blur" }],
  lab_type: [{ required: true, message: "请选择实验室类型", trigger: "blur" }],
  college_type: [
    { required: true, message: "请选择所属院系", trigger: "blur" },
  ],
});

// 确定，提交表单
const submitForm = async () => {
  await axios.put(`/adminapi/labs/${currentItem.value.id}`, updateForm.value);
  dialogVisible.value = false;
  getList();
};

// 预览实验室
const preDialogVisible = ref(false);
const handleLocation = (item) => {
  preDialogVisible.value = true;
  currentItem.value = item;
  // console.log(currentItem.value);
};
</script>
<style lang="scss" scoped>
// .el-tag {
//   --el-tag-text-color: white;
// }
</style>
