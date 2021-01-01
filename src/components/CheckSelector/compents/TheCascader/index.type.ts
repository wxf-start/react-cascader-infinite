export interface Props {
  title: string; // 标题
  list: any[]; // 列表
  showId: number | undefined; // 展示的id
  defaultCheckedList: any[]; // 默认选择的数据
  dataLength?: number; // 列表长度
  setChidrenInfo: (values: any) => void; // 展开的数据项信息
  currentChange?: (e: any, values: any) => void; // 当前改变
}
