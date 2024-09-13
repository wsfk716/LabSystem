import Home from "@/views/home/Home.vue";
import UserList from "@/views/user-manage/UserList.vue";
import RightList from "@/views/right-manage/RightList.vue";
import RoleList from "@/views/right-manage/RoleList.vue";
import LabList from "@/views/lab-manage/LabList.vue";
import AddLab from "@/views/lab-manage/AddLab.vue";
import LabTypeList from "@/views/lab-manage/LabTypeList.vue";
import AuditList from "@/views/book-manage/AuditList.vue";
import BookList from "@/views/book-manage/BookList.vue";
import AddBook from "@/views/book-manage/AddBook.vue";
import CollegeList from "../views/set/CollegeList.vue";
import ClassesList from "../views/set/ClassesList.vue";
const routes = [
  {
    path: "/index",
    component: Home,
  },
  {
    path: "/user-manage/list",
    component: UserList,
  },
  {
    path: "/right-manage/rolelist",
    component: RoleList,
  },
  {
    path: "/right-manage/rightlist",
    component: RightList,
  },
  {
    path: "/lab-manage/lablist",
    component: LabList,
  },
  {
    path: "/lab-manage/addlab",
    component: AddLab,
  },
  {
    path: "/book-manage/auditlist",
    component: AuditList,
  },
  {
    path: "/book-manage/booklist",
    component: BookList,
  },
  {
    path: "/book-manage/addbook",
    component: AddBook,
  },
  {
    path: "/lab-manage/LabTypeList",
    component: LabTypeList,
  },
  {
    path: "/set/collegelist",
    component: CollegeList,
  },
  {
    path: "/set/classeslist",
    component: ClassesList,
  },
];

export default routes;
