<template>
  <div>
    <div
      style="min-height: 850px; justify-content: center; position: relative"
      id="map"
    />
    <!-- 添加对话框 -->
    <el-dialog v-model="addDialogVisible" :title="currentItem.t" width="35%">
      <el-form
        ref="addFormRef"
        style="width: 100%"
        :model="addForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="预约日期">
          <el-date-picker
            v-model="addForm.book_time"
            type="date"
            placeholder="请选择日期"
            size="large"
            style="width: 100%"
            :disabled-date="handleDisabledDate"
            @change="handleChangeDate"
          />
        </el-form-item>

        <el-form-item label="预约课节" prop="book_class">
          <el-select
            v-model="addForm.book_class"
            placeholder="请选择课节"
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in courseList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="disableSelect.includes(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预约原因" prop="book_reason">
          <el-input
            v-model="addForm.book_reason"
            style="width: 100%"
            :rows="2"
            type="textarea"
            placeholder="请输入预约理由"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ImageLayer, PointLayer, Scene, Popup } from "@antv/l7";
import { Map } from "@antv/l7-maps";
import { onMounted } from "vue";
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { courseList } from "../../utils/type";
import { useUserStore } from "../../store/useUserStore";
import { url } from "../../utils/BgUrlConfig";
let scene, popup;

const { user } = useUserStore();
onMounted(() => {
  scene = new Scene({
    id: "map",
    map: new Map({
      center: [500, 500],
      zoom: 3,
      version: "SIMPLE",
      mapSize: 1000,
      maxZoom: 5,
      minZoom: 2,
      pitchEnabled: false,
      rotateEnabled: false,
    }),
  });
  scene.setBgColor("rgb(94, 182, 140)");
  // 添加图片图层
  const imagelayer = new ImageLayer({}).source(url, {
    parser: {
      type: "image",
      extent: [360, 400, 640, 600],
    },
  });

  scene.on("loaded", () => {
    getLabList();
    scene.addLayer(imagelayer);
  });
});

// 添加预约实验室对话框
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
  book_class: "",
  book_time: "",
  book_reason: "",
});
const currentItem = ref({});
const rules = ref({
  book_class: [{ required: true, message: "请选择课节", trigger: "change" }],
  book_time: [{ required: true, message: "请选择日期", trigger: "change" }],
  book_reason: [{ required: true, message: "请输入预约理由", trigger: "blur" }],
});

// 获取实验室列表
const LabList = ref([]);
const getLabList = async () => {
  const res = await axios.get("/adminapi/labs");
  LabList.value = res.data.data;
  const list = LabList.value.map((item) => {
    return {
      x: item.x,
      y: item.y,
      t: "预约" + item.title,
      id: item.id,
    };
  });
  addTextLayer(list);
};

const addTextLayer = (data) => {
  const textlayer = new PointLayer({ zIndex: 2 })
    .source(data, {
      parser: {
        type: "json",
        x: "x",
        y: "y",
      },
    })
    .shape("t", "text")
    .size(14)
    .active({
      color: "#00f",
      mix: 0.9,
    })
    .color("rgb(13, 71, 161)")
    .style({
      textAnchor: "center", // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      spacing: 2, // 字符间距
      fontWeight: "800",
      padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: "#ffffff", // 描边颜色
      strokeWidth: 2, // 描边宽度
      textAllowOverlap: true,
    });
  scene.addLayer(textlayer);

  textlayer.on("click", (e) => {
    console.log(e);
    addDialogVisible.value = true;
    currentItem.value = e.feature;
  });
};

// 处理日期选择范围
// 禁用日期
const handleDisabledDate = (time) => {
  return (
    time.getTime() < Date.now() ||
    time.getTime() > Date.now() + 7 * 24 * 60 * 60 * 1000
  );
};

const handleCancel = () => {
  addDialogVisible.value = false;
  clear();
};

// 提交确定按钮
const handleAddConfirm = () => {
  // 提交表单前校验
  if (addFormRef.value) {
    addFormRef.value.validate(async (valid) => {
      if (valid) {
        // 提交表单
        // console.log(user.username);
        // console.log(currentItem.value);

        if (valid) {
          await axios.post("/adminapi/books", {
            ...addForm.value,
            book_username: user.username,
            lab_id: currentItem.value.id,
          });
          ElMessage.success("预约成功");
          addDialogVisible.value = false;
          clear();
        } else {
          console.log("error submit!");
          return false;
        }
      } else {
        return false;
      }
    });
  }
};

const clear = () => {
  addForm.value.book_time = "";
  addForm.value.book_class = "";
  addForm.value.book_reason = "";
};

// 日期选择改变
const handleChangeDate = async (val) => {
  addForm.value.book_class = "";
  console.log(val);
  console.log(currentItem.value.id);
  // 这里应该是获取当前的日期去后台查询,指定实验室的这一天的课节预约状况
  const res = await axios.post("/adminapi/books/select", {
    book_time: val,
    lab_id: currentItem.value.id,
  });
  // 这里从后端返回的数据里已经筛选过了可以选的课节。
  disableSelect.value = res.data.data.map((item) => item.book_class);
  // 我可以对整个课节进行遍历，查询数据库是否已经存在这一天这个课节的预约，如果存在就返回true
  // handleDisabledClass(val);
};
const disableSelect = ref([]);
</script>
