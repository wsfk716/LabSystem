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

      <el-table-column label="预约人" v-admin>
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
      <el-table-column label="操作" v-teacher>
        <template #default="scope" size="large" effect="dark">
          <el-popconfirm
            title="你确定要撤销吗？"
            @confirm="handleDelete(scope.row)"
            confirmButtonText="确定"
            cancelButtonText="取消"
            width="160px"
          >
            <template #reference>
              <el-button type="danger" round> 撤销 </el-button>
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
  if (user.role.roleType === ADMIN) {
    await axios.get(`/adminapi/books`).then((res) => {
      tableData.value = res.data.data;
      // console.log(res.data.data);
    });
  } else if (user.role.roleType === TEACHER) {
    await axios
      .get(`/adminapi/books?book_username=${user.username}`)
      .then((res) => {
        tableData.value = res.data.data;
        // console.log(res.data.data);
      });
  }
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

const handleDelete = (item) => {
  axios.delete(`/adminapi/books/${item.id}`).then((res) => {
    getBookList();
  });
};

// 创建vue指令
const vTeacher = {
  mounted(el) {
    // console.log(el);
    if (user.role.roleType !== TEACHER) {
      el.remove();
    }
  },
};

const vAdmin = {
  mounted(el) {
    // console.log(el);
    if (user.role.roleType !== ADMIN) {
      el.remove();
    }
  },
};
</script>
<style lang="scss" scoped></style>
