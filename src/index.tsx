// 第三方库
import React, { useRef, useState } from "react";
// 组件
import { TheCheckSelector, TheListCheckResult } from "./components";

// 类型定义
interface Props {
  data?: any; // 渲染的数据
  getResult?: (values: any) => void;
  onChange?: (checked: boolean, item: any) => void;
}

/**
 * @description 层级勾选选择器
 * @param {object} prop - 父级数据
 * @returns {component} 返回层级勾选选择器组件
 */
const LevelCheckSelector: React.FC<Props> = props => {
  // 父级数据
  const { data, getResult, onChange } = props;
  // 已选
  const [checkList, setCheckList] = useState<any[]>([]);
  // 层级列表ref
  const hierarchyRef = useRef<any | null>(null);

  /**
   * @description 获取勾选的结果
   * @param {array} res - 已勾选数据
   */
  const getCheckedResult = (res: any[]) => {
    setCheckList([...res]);
    if (getResult) {
      getResult([...res]);
    }
  };
  /**
   * @description 清楚指定项
   * @param {object | number} items - 指定项 number -1 全清空
   */
  const clearItems = (items: any) => {
    if (hierarchyRef && hierarchyRef.current) {
      // ref 调用子级的方法
      if(items.id){
        hierarchyRef.current.remove(items.id);
      }else {
        hierarchyRef.current.clear();
      }
 
    }
  };

  /**
   * @description 当前项改变
   * @param {boolean} e checked
   * @param {object} o 改变的项
   */
  const getCurrentChange = (e: any, o: any) => {
    if (onChange) {
      onChange(e.target.checked, o);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {data && data.children.length > 0 && (
        <>
          <TheCheckSelector
            cRef={hierarchyRef}
            data={data}
            getCurrentChange={getCurrentChange}
            getCheckedResult={getCheckedResult}
          />
          <TheListCheckResult list={checkList} clearItems={clearItems} />
        </>
      )}
    </div>
  );
};

export default LevelCheckSelector;
