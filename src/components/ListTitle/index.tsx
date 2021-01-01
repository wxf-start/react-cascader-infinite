// 第三方库
import React from 'react';
// 类型声明
import { Props } from './index.type';
import styles from "./styles.less";


/**
 * @description 添加关键词
 * @param {object} prop - 父级数据
 */
const ListTitle: React.FC<Props> = (props) => {
  const { title, list, children, clearItems } = props;
  const clearAll = () => {
    if (clearItems) {
      clearItems(-1);
    }
  };
  return (

    <div className={styles.wrap}>
      <span className={styles.title}>{title}</span>
      {children}
      {list && list.length > 0 && (
        <span className={styles.clear_all} onClick={clearAll}>
          清空
        </span>
      )}
    </div>
  );
};
ListTitle.defaultProps = {
  list: [], // 列表
  title: '已选',
};
export default ListTitle;
