export interface Props {
  plainOptions: any[]; // 全部选择项
  defaultCheckedList: any[]; // 默认选择项
  getGroupCheckedResult?: any;
  showAll?: boolean; // 是否显示全选
  limit?: number; // 限制个数
  disabled?: boolean; // 是否可点击全选
  showId?: number; // 展示的id
  setNextId?: (values?: number | string | undefined) => void; // 设置下一级显示的id
  getCheckedChange?: (e: any, values?: object) => void; // 获取实时的改变的数据
}

export interface CheckProps {
  plainOptions: any[]; // 所有选项
  checkedList: any[]; // 已选择
  indeterminate: boolean; // 控制全选样式
  checkAll: boolean; // 是否全选
}
