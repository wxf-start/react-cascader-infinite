export interface Props {
  data: any; // 数据
  cRef: any; // ref
  getCheckedResult?: (res: any[]) => void; // 获取勾选的结果
  getCurrentChange?: (e: any, value: any) => void; // 实时改变
}
