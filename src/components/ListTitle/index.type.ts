export interface Props {
  children?: any;
  title?: string; // 标题
  list?: any[]; // 列表
  clearItems?: (vaule: number) => void; // 删除所有
}
