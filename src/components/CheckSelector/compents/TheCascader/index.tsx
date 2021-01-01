// 第三方库
import React, { useState, useEffect } from "react";
// 自定义的组件
import { TheListCheckbox } from "./commpent";
import TheListTitle from "../../../ListTitle";
import styles from "./styles.less";


// 类型定义
import { Props } from "./index.type";

/**
 * @description 层级组件
 */
const TheCascader: React.FC<Props> = props => {
  const {
    title,
    list,
    showId,
    defaultCheckedList,
    dataLength,
    setChidrenInfo,
    currentChange
  } = props;

  // 计划列表
  const [planList, setPlanList] = useState<any[]>([]);

  /**
   * @description 设置下一级的信息
   * @param {number | string | undefined} id  唯一值
   */
  const setNextId = (id: number | string | undefined) => {
    if (id) {
      const selectInfo: any = planList.find((el: any) => {
        return el.id === id;
      });

      setChidrenInfo(selectInfo);
    }
  };

  /**
   * @description 依赖列表设置计划列表
   */
  useEffect(() => {
    setPlanList([...list]);
  }, [list]);

  /**
   * @description 当前勾选上交到父级
   * @param {any} e  当前事件信息
   * @param {any} item 项
   */
  const getCheckedChange = (e: any, item: any) => {
    if (currentChange) {
      currentChange(e, item);
    }
  };

  /**
   * @description 构建计划列表代码块
   */
  const renderPlanWrap = () => {
    return (
      <div
        className={`${styles.plan_wrap} ${
          dataLength === 1 ? styles.plan_single : styles.play_more
        }`}
      >
        <TheListTitle title={title} />
        <div className={`${styles.plan_wrap_list}`}>
          <TheListCheckbox
            plainOptions={planList}
            defaultCheckedList={defaultCheckedList}
            showId={showId}
            setNextId={setNextId}
            getCheckedChange={getCheckedChange}
          />
        </div>
        <div />
      </div>
    );
  };
  return <div style={{ width: "100%" }}>{renderPlanWrap()}</div>;
};

export default TheCascader;
