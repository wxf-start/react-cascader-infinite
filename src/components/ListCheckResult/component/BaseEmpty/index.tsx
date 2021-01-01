// 第三方库
import React from "react";
import { Typography } from "antd";
// 类型声明
import { Props } from "./index.type";
import styles from "./styles.less";



const { Text } = Typography;

/**
 * @description 选择下拉菜单
 * @param {object} props - 父级数据
 */
const EmptyData: React.FC<Props> = props => {
  // 父级数据
  const { text } = props;
  return (
    <div className={styles.wrap}>
      {text && text.length > 0 && <Text type="secondary"> {text}</Text>}
    </div>
  );
};

export default EmptyData;
