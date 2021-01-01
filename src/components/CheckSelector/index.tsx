// 第三方库
import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import _ from "lodash";
// 组件
import TheCascader from "./compents/TheCascader";
// 类型声明
import { Props } from "./index.type";
import styles from "./styles.less";

import {
  controlTreeHighestAll,
  controlTreeIndeterminate,
  controlTreeParentNotChecked,
  controlTreeChildrenChecked,
  controlTreeParentChecked,
  controlTreeChildrenDisabled
} from "./utils";

/**
 * @description 递归渲染checkbox选择组件
 * @param {object} prop - 父级数据
 */
const CheckSelector: React.FC<Props> = props => {
  // 父级数据
  const { data, cRef, getCheckedResult, getCurrentChange } = props;
  // 渲染的
  const [cascaderList, setCascaderList] = useState<any[]>([]);
  // 层级列表ref
  const hierarchyRef = useRef<any | null>(null);
  // 实时改变的最全父级
  const [completeList, setCompleteList] = useState<any>([]);

  /**
   * @description 根据id选中某个值
   * @param {number | string | undefined} id  唯一值
   */
  const setCheckedValues = (id: number) => {
    let list: any = [];
    if (id) {
      // 向下判断子级
      list = controlTreeChildrenChecked(completeList, id, true);
      // 向上判断父级
      list = controlTreeParentChecked(list, id);
    } else {
      // 最高层级选中
      list = controlTreeHighestAll(completeList, true);
    }
    setCompleteList([...list]);
  };

  /**
   * @description 初始化默认
   * @param {number | string | undefined} id  唯一值
   * @param {array} dataArr  初始化数据
   */
  const setDefalutList = (id: number | string, defaultList: any[]) => {
    if (id) {
      const list: any = controlTreeChildrenChecked(defaultList, id, true);
      setCompleteList([...list]);
    }
  };

  /**
   * @description 初始化默认
   * @param {number | string | undefined} id  唯一值
   * @param {array} dataArr  初始化数据
   */
  const setDisabedList = (id: number | string, defaultList: any[]) => {
    if (id) {
      const list: any = controlTreeChildrenDisabled(defaultList, id);
      setCompleteList([...list]);
    }
  };

  /**
   * @description 删除某项
   * @param {id} id  项
   */
  const deleteCheckedValues = (id: string | number) => {
    let list: any = [];
    list = controlTreeChildrenChecked(completeList, id, false);
    list = controlTreeParentNotChecked(list, id, false);
    setCompleteList([...list]);
  };

  // 暴露给父级的方法
  useImperativeHandle(cRef, () => ({
    // 移除
    remove: (id: string | number) => {
      deleteCheckedValues(id);
    },
    // 删除所有
    clear: () => {
      let list: any = [];
      list = controlTreeHighestAll(completeList, false);
      setCompleteList([...list]);
    },
    // 选中
    select: (id: number) => {
      setCheckedValues(id);
    }
  }));

  /**
   * @description 设置初始化数据
   */
  useEffect(() => {
    if (data) {
      // // 初始化数据
      if (data.children) {
        setCompleteList([...data.children]);
      }

      // 初始化禁选数据
      if (data.disabledValue && data.disabledValue.length > 0) {
        data.disabledValue.forEach((id: number | string) => {
          setDisabedList(id, data.children);
        });
      }

      // 初始化默认数据
      if (data.defaultValue && data.defaultValue.length > 0) {
        data.defaultValue.forEach((id: number | string) => {
          setDefalutList(id, data.children);
        });
      }

      // 初始化级联
      let list: any[] = [];
      list.push({
        level: 0,
        ...data
      });
      setCascaderList(list);
    }
  }, []);

  /**
   * @description 设置展开的子级信息
   * @param {object} selectInfo  子信息
   */
  const setChidrenInfo = (selectInfo: any = {}) => {
    const list: any[] = [];
    let filterCheckList: any = [];
    if (selectInfo.children) {
      filterCheckList = selectInfo.children.filter((filterInfo: any) => {
        return filterInfo.checked === true;
      });
    }
    const obj: any = {
      ...selectInfo,
      title: selectInfo.name,
      defaultCheckedList: filterCheckList
    };

    list.push(obj);
    if (cascaderList) {
      const hasChildren = _.findIndex(cascaderList, (o: any) => {
        return o.level === selectInfo.level && o.id === selectInfo.id;
      });

      // 如果存在
      if (hasChildren === -1) {
        const levelIndex: any = _.findIndex(cascaderList, (o: any) => {
          return o.level === selectInfo.level;
        });

        // 如果该层级存在，根据索引移除原来的
        if (levelIndex !== -1) {
          cascaderList.splice(levelIndex, cascaderList.length - levelIndex);
        }

        const overList: any[] = [...cascaderList, ...list];

        overList.forEach((el: any, index: number) => {
          if (
            overList[index - 1] &&
            selectInfo.level - 1 === overList[index - 1].level
          ) {
            overList[index - 1].showId = selectInfo.id;
            overList[index - 1].showName = selectInfo.name;
          }
        });

        if (overList && overList.length > 2) {
          setTimeout(() => {
            hierarchyRef.current.scrollLeft = 255;
          });
        }
        setCascaderList([...overList]);
      }
    }
  };
  const allCheckedList: any = [];

  /**
   * @description 给父亲显示的已选数据
   * @param {array} list 数据列表
   */
  const getCheckedValues = (list: any[]) => {
    if (!list) return [];
    list.forEach((el: any) => {
      if (el.checked) {
        const checkedList = el.children.filter((child: any) => {
          return child.checked;
        });
        if (checkedList.length !== el.children.length) {
          getCheckedValues(el.children);
        } else {
          allCheckedList.push(el);
        }
      } else if (!el.checked && el.children && el.children.length > 0) {
        getCheckedValues(el.children);
      }
    });

    return allCheckedList;
  };

  /**
   * @description 找到显示的
   * @param {array} list 数据列表
   */
  const findShowList = (list: any[]) => {
    if (list && list.length > 0) {
      list.forEach((el: any) => {
        // 根据checked设置父级非全选
        controlTreeIndeterminate(el);
        // 用于显示cascaderList的显示chekcbox
        if (cascaderList && cascaderList.length > 0) {
          cascaderList.forEach((tabItem: any) => {
            // 如果层级相同 id 相同
            if (tabItem.level === el.level && tabItem.id === el.id) {
              let filterCheckList: any = [];
              // 找到子级
              if (tabItem.children && tabItem.children.length > 0) {
                filterCheckList = tabItem.children.filter((filterInfo: any) => {
                  return filterInfo.checked === true;
                });

                tabItem.defaultCheckedList = filterCheckList;
                findShowList(tabItem.children);
              }
            } else if (tabItem.level !== el.level && tabItem.id !== el.id) {
              // 层级与id不相同 找当前级
              let filterCheckList: any = [];
              filterCheckList = tabItem.children.filter((filterInfo: any) => {
                return filterInfo.checked === true;
              });
              tabItem.defaultCheckedList = filterCheckList;
            }
            return tabItem;
          });
        }
      });
    }
    return cascaderList;
  };

  /**
   * @description 依赖完整的list得到已选id等
   */
  useEffect(() => {
    if (completeList && completeList.length > 0) {
      // 设置显示
      const list: any = findShowList(completeList);
      setCascaderList([...list]);
      // 获取已选id
      const checkedList = getCheckedValues(completeList);
      // 父级获取所有的结果
      if (getCheckedResult) {
        getCheckedResult(checkedList);
      }
    }
  }, [completeList]);

  const currentChange = (e: any, o: any) => {
    if (e.target.checked) {
      setCheckedValues(o.id);
    } else {
      deleteCheckedValues(o.id);
    }
    if (getCurrentChange) {
      getCurrentChange(e, o);
    }
  };

  return (
    <div className={`${styles.wrap}`} ref={hierarchyRef}>
      <>
        {cascaderList &&
          cascaderList.length > 0 &&
          cascaderList.map(item => {
            return (
              <TheCascader
                dataLength={cascaderList.length}
                key={item.level}
                title={item.title}
                showId={item.showId}
                list={item.children}
                defaultCheckedList={item.defaultCheckedList}
                setChidrenInfo={setChidrenInfo}
                currentChange={currentChange}
              />
            );
          })}
      </>
    </div>
  );
};

export default CheckSelector;
