<template>
  <div>
    <el-button type="primary" @click="handleAddCollege()">添加课节</el-button>
    <el-table :data="tableData" stripe style="width: 100%" row-key="id">
      <el-table-column prop="name" label="课节名称" width="180" />
      <el-table-column prop="start_time" label="开始时间" width="180" />
      <el-table-column prop="end_time" label="结束时间" width="180" />
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
  <el-dialog v-model="EditDialogVisible" title="修改课节信息" width="35%">
    <el-form
      ref="EditFormRef"
      style="width: 100%"
      :model="EditForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="课节名称" prop="title">
        <el-input v-model="EditForm.name" />
      </el-form-item>
      <el-form-item label="开始时间" prop="description">
        <el-time-select
          v-model="EditForm.start_time"
          style="width: 240px"
          :max-time="EditForm.end_time"
          class="mr-4"
          placeholder="Start time"
          start="08:30:00"
          step="00:15:00"
          end="18:30:00"
          format="HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="lab_counts">
        <el-time-select
          v-model="EditForm.end_time"
          style="width: 240px"
          :min-time="EditForm.start_time"
          placeholder="End time"
          start="08:30:00"
          step="00:15:00"
          end="22:30:00"
          format="HH:mm:ss"
        />
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
  <el-dialog v-model="AddDialogVisible" title="修改课节信息" width="35%">
    <el-form
      ref="AddFormRef"
      style="width: 100%"
      :model="AddForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="课节名称" prop="title">
        <el-input v-model="AddForm.name" />
      </el-form-item>
      <el-form-item label="开始时间" prop="description">
        <el-time-select
          v-model="AddForm.start_time"
          style="width: 240px"
          :max-time="AddForm.end_time"
          class="mr-4"
          placeholder="Start time"
          start="08:30:00"
          step="00:15:00"
          end="18:30:00"
          format="HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="lab_counts">
        <el-time-select
          v-model="AddForm.end_time"
          style="width: 240px"
          :min-time="AddForm.start_time"
          placeholder="End time"
          start="08:30:00"
          step="00:15:00"
          end="22:30:00"
          format="HH:mm:ss"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm"> 确定 </el-button>
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
  await axios.get("/adminapi/classes").then((res) => {
    tableData.value = res.data.data;
    // console.log(res.data.data);
  });
};

// const startTime = ref("");
// const endTime = ref("");
// 更新相关内容------------------
const EditForm = ref({
  name: "",
  start_time: "",
  end_time: "",
});
const EditDialogVisible = ref(false);
const rules = {
  name: [{ required: true, message: "请输入课节名称", trigger: "blur" }],
  start_time: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
  end_time: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
};
const EditFormRef = ref(null);
const currentItem = ref({});
const handleUpdate = (row) => {
  EditDialogVisible.value = true;
  currentItem.value = row;
  EditForm.value = {
    name: row.name,
    start_time: row.start_time,
    end_time: row.end_time,
  };
};

// 确定
const submitEditForm = () => {
  EditFormRef.value.validate(async (valid) => {
    if (valid) {
      // console.log("submit!");
      // console.log(EditForm.value);
      await axios.put(`/adminapi/classes/${currentItem.value.id}`, {
        name: EditForm.value.name,
        // start_time: moment(EditForm.value.start_time).format('HH:mm:ss'),
        // end_time: moment(EditForm.value.end_time).format('HH:mm:ss'),
        start_time: EditForm.value.start_time,
        end_time: EditForm.value.end_time,
      });
      EditDialogVisible.value = false;
      getList();
    }
  });
};

// 删除
const handleDelete = async (row) => {
  await axios.delete(`/adminapi/classes/${row.id}`);
  getList();
  ElMessage.success("删除成功");
};

// 添加相关内容------------------
const AddDialogVisible = ref(false);
const AddForm = ref({
  name: "",
  start_time: "",
  end_time: "",
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
      await axios.post("/adminapi/classes", AddForm.value);
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
