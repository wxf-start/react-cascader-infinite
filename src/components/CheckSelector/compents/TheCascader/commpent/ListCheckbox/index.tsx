// 第三方库
import _ from "lodash";
import { Checkbox, Row, Col } from "antd";
import React, { useState, useEffect } from "react";

// 类型声明
import { Props, CheckProps } from "./index.type";

// css模块
import styles from "./styles.less";

const { Group } = Checkbox;

/**
 * @description 自定义checkbox
 */
const TheCheckbox: React.FC<Props> = props => {
  // 父级数据
  const {
    plainOptions,
    defaultCheckedList,
    showAll,
    limit,
    showId,
    setNextId,
    getCheckedChange
  } = props;

  // 默认的数据id
  const formattedCheckedList = defaultCheckedList.map(item => {
    return item.id;
  });

  const [allDisabled, setAllDisabled] = useState<boolean>(false);
  // 初始化数据
  const [state, setState] = useState<CheckProps>({
    plainOptions: [],
    checkedList: [],
    indeterminate: false,
    checkAll: false
  });

  // 全选
  const [allValuesChecked, setAllValuesChecked] = useState([]);

  /**
   * @description 依赖默认项 与初始化数据
   */
  useEffect(() => {
    if (plainOptions) {
      // @ts-ignore
      setAllValuesChecked(() => {
        return plainOptions.map(item => {
          return item.id;
        });
      });

      const allDisabled = plainOptions.every(item => {
        return item.disabled;
      });
      setAllDisabled(allDisabled)

      setState({
        plainOptions,
        checkedList: formattedCheckedList,
        indeterminate:
          !!formattedCheckedList.length &&
          formattedCheckedList.length < plainOptions.length,
        checkAll: formattedCheckedList.length === plainOptions.length
      });
    }
  }, [defaultCheckedList, plainOptions]);

  /**
   * @description 监听点击事件 超过个数禁止点击
   */
  useEffect(() => {
    if (!limit) return;

    // 如果超过个数 未选中的 disabled true
    if (state.checkedList && state.checkedList.length === limit) {
      _.forEach(plainOptions, (o: any) => {
        if (_.includes(state.checkedList, o.id)) {
          o.disabled = false;
        } else {
          o.disabled = true;
        }
      });
    } else {
      _.forEach(plainOptions, (o: any) => {
        o.disabled = false;
      });
    }
  }, [state.checkedList, plainOptions]);

  /**
   * @description 改变选择项
   * @parmas {Array} 已选择的项
   * @return 已选项为选择的项
   */
  const onChange = (checkedList: any[]) => {
    const checkInfo = {
      ...state,
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length
    };

    return setState({ ...checkInfo });
  };

  /**
   * @description 全选
   * @parmas {Array} 全选的event
   * @return 已选项为全部选项
   */
  const onCheckAllChange = (e: any) => {
    // 控制全选的选项项
    const checkedArr: any[] = e.target.checked ? allValuesChecked : [];
    // 传递给父级
    if (getCheckedChange) {
      getCheckedChange(e, { id: plainOptions[0].parent });
    }
    return setState({
      ...state,
      checkedList: checkedArr,
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  /**
   * @description 全选与默认
   */
  const handlerCheckbox = () => {
    return (
      <div>
        {showAll && (
          <Checkbox
            disabled={allDisabled}
            className={`${styles.checkbox_header}`}
            indeterminate={state.indeterminate}
            onChange={onCheckAllChange}
            checked={state.checkAll}
          >
            {state.checkAll ? "取消全选" : "全选"}
          </Checkbox>
        )}
      </div>
    );
  };

  /**
   * @description 点击当前项激活 显示下一级
   * @param {object} item - 项
   */
  const hanlderActive = (item: any) => {
    const { children, id } = item;

    if (id && children && children.length !== 0) {
      if (setNextId) {
        setNextId(id);
      }
    }
  };

  /**
   * @description 单个勾选
   * @param {any} e  当前事件信息
   * @param {any} item 项
   */
  const handlerChange = (e: any, item: any) => {
    hanlderActive(item);
    // 当前选项的勾选事件
    if (getCheckedChange) {
      getCheckedChange(e, item);
    }
  };

  /**
   * @description 设置checkbox 半选状态
   * @param {boolean} checked 是否选中
   * @param {boolean} indeterminate 是否半选
   */
  const handlerIndeterminate = ({
    checked,
    indeterminate
  }: {
    checked: boolean;
    indeterminate: boolean;
  }) => {
    let res: boolean = false;

    if (!checked && indeterminate === true) {
      res = true;
    }
    return res;
  };

  /**
   * @description 构建checkbox组代码块
   */
  const renderGroup = () => {
    return (
      <Group
        style={{ width: "100%", height: "100%" }}
        value={state.checkedList}
        onChange={onChange}
      >
        <Row>
          <div className={`${styles.col_wrap}`}>
            {plainOptions.map(o => (
              <Col
                span={24}
                key={o.id}
                className={`${styles.col_custom} ${
                  o.children && o.children.length > 0 ? styles.more_custom : ""
                }`}
              >
                {o.children && o.children.length > 0 ? (
                  <>
                    <Checkbox
                      disabled={o.disabled}
                      onClick={(e: any) => handlerChange(e, o)}
                      indeterminate={handlerIndeterminate(o)}
                      key={o.id}
                      value={o.id}
                    />
                    <div
                      className={`${styles.select} ${
                        showId === o.id ? styles.col_active : ""
                      }`}
                      onClick={() => {
                        hanlderActive(o);
                      }}
                    >
                      {`${o.name || o.value}`}
                      <span>{">"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Checkbox
                      disabled={o.disabled}
                      key={o.id}
                      value={o.id}
                      onClick={(e: any) => handlerChange(e, o)}
                    >
                      {`${o.name || o.value}`}
                    </Checkbox>
                  </>
                )}
              </Col>
            ))}
          </div>
        </Row>
      </Group>
    );
  };
  return (
    <>
      {state.plainOptions.length > 0 && (
        <div className={`${styles.wrap}`}>
          {showAll && handlerCheckbox()}
          {renderGroup()}
        </div>
      )}
    </>
  );
};

// 默认
TheCheckbox.defaultProps = {
  defaultCheckedList: [],
  showAll: true // 全选checkbox
};

export default TheCheckbox;
