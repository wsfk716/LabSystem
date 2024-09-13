<template>
  <div>
    <el-table :data="filterTableData" stripe style="width: 100%" row-key="id">
      <el-table-column label="名称">
        <template #default="scope">
          <el-link @click="handleLocation(scope.row)">{{
            scope.row.lab.title
          }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="预约人">
        <template #header>
          <el-input v-model="searchForm" placeholder="搜索" />
        </template>
        <template #default="scope">
          <div>{{ scope.row.book_username }}</div>
        </template>
      </el-table-column>

      <el-table-column label="预约时间">
        <template #default="scope" size="large" effect="dark">
          <el-tag type="primary" style="height: 40px; line-height: 20px"
            >{{ moment(scope.row.book_time).format("YYYY-MM-DD") }}
            <br />
            {{ class_method(scope.row.book_class) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预约状态">
        <template #default="scope" size="large" effect="dark">
          <el-tag
            style="height: 40px; line-height: 20px; font-size: 14px"
            :type="Book_state_type[scope.row.book_state]"
            >{{ Book_state_text[scope.row.book_state] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope" size="large" effect="dark">
          <el-button type="primary" round @click="handleAccess(scope.row)">
            批准
          </el-button>
          <el-popconfirm
            title="你确定要驳回吗？"
            @confirm="handleReject(scope.row)"
            confirmButtonText="确定"
            cancelButtonText="取消"
            width="160px"
          >
            <template #reference>
              <el-button type="danger" round> 驳回 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 预览实验室弹出框 -->
  <el-dialog
    v-model="preDialogVisible"
    title="预览实验室"
    :fullscreen="true"
    v-if="preDialogVisible"
  >
    <LabMap
      :x="currentItem.lab.x"
      :y="currentItem.lab.y"
      :t="currentItem.lab.title"
    ></LabMap>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import {
  courseList,
  Book_state_text,
  Book_state_type,
  AUDIT,
  APPROVE,
  REJECT,
  ADMIN,
  TEACHER,
} from "../../utils/type";
import LabMap from "../../components/lab-manage/LabMap.vue";
import { useUserStore } from "../../store/useUserStore";
import moment from "moment";
const { user } = useUserStore();
const tableData = ref([]);
const searchForm = ref("");
onMounted(() => {
  getBookList();
});
const filterTableData = computed(() => {
  return tableData.value.filter((item) => {
    return item.book_username.includes(searchForm.value);
  });
});
const getBookList = async () => {
  await axios.get(`/adminapi/books?book_state=0`).then((res) => {
    tableData.value = res.data.data;
    // console.log(res.data.data);
  });
};

const class_method = (value) => {
  const res = courseList.find((item) => item.value === value);

  return res.label;
};

// 预览实验室
const currentItem = ref({});
const preDialogVisible = ref(false);
const handleLocation = (item) => {
  preDialogVisible.value = true;
  currentItem.value = item;
  // console.log(currentItem.value);
};

// 批准 修改预约状态为1
const handleAccess = (item) => {
  // console.log(item);
  axios
    .put(`/adminapi/books/${item.id}`, {
      book_state: 1,
    })
    .then((res) => {
      getBookList();
    });
};

// 驳回
const handleReject = (item) => {
  axios
    .put(`/adminapi/books/${item.id}`, {
      book_state: 2,
    })
    .then((res) => {
      getBookList();
    });
};
</script>
<style lang="scss" scoped></style>
