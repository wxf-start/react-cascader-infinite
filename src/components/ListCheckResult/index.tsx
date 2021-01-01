// 第三方库
import React from "react";
// 自定义组件
import TheListTitle from "../ListTitle";
import BaseEmpty from "./component/BaseEmpty";
// 引入样式

const styles = require('./styles.less');


// 类型定义
interface Props {
  title?: string;
  list: any[]; // 计划结果
  clearItems?: (value: any) => void; // 清楚的项
}
/**
 * @description 计划结果
 * @param {object} props - 父级数据
 * @returns {component} 返回选择下拉菜单
 */
const PlanResult: React.FC<Props> = props => {
  // 父级数据
  const { list, title, clearItems } = props;
  /**
   * @description 删除项
   * @param {object | number } item - 选中删除的当前项  -1全部删除
   */
  const deleteItems = (item: any) => {
    if (clearItems) {
      clearItems(item);
    }
  };

  /**
   * @description 已选结果
   */
  const renderList = () => {
    return list && list.length > 0 ? (
      <div className={styles.wrap_list}>
        {list.map((item: any) => {
          return (
            <div key={item.id}>
              <span className={styles.single_ellipsis}>{item.name || item.value}</span>
              <div onClick={() => deleteItems(item)}>删除</div>
            </div>
          );
        })}
      </div>
    ) : (
      <BaseEmpty />
    );
  };
  return (
    <div className={styles.wrap}>
      <TheListTitle list={list} title={title} clearItems={deleteItems} />
      {renderList()}
    </div>
  );
};
PlanResult.defaultProps = {
  title: "已选" // 标题
};
export default PlanResult;
