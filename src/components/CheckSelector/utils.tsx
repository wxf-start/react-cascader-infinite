export interface DataProps {
  level: number; // 层级
  children: DataProps[]; // 子项
  id: number | string; // 唯一标识
  name: string; // 名称
  parent: number; // 父级id
  checked?: boolean; // 是否选中
  indeterminate?: boolean; // 是否为半选标识
}

/**
 * @description 控制树最高层级的全选与取消全选
 * @param {array} data  数据
 * @param {boolean} checked  是否选中
 */
export const controlTreeHighestAll = (data: DataProps[], checked: boolean) => {
  if (data && data.length > 0) {
    data.forEach((el: any) => {
      el.checked = checked;
      el.indeterminate = checked;
      if (el.children) {
        el.children.forEach(() => {
          controlTreeHighestAll(el.children, checked);
        });
      }
    });
  }
  return data;
};

/**
 * @description 控制树的半选状态
 * @param {array} data  数据
 */
export const controlTreeIndeterminate = (data: DataProps) => {
  if (!data.children || data.children.length === 0) {
    return !!data.checked;
  }
  data.children.forEach((item: any) => {
    if (item.children && item.children.length) {
      item.indeterminate = controlTreeIndeterminate(item);
    } else {
      item.indeterminate = !!item.checked;
    }
  });
  data.indeterminate = data.children.some((item: any) => {
    return !!item.indeterminate;
  });
  return !!data.indeterminate;
};

/**
 * @description 子级未选中，父级也非选
 * @param {array} data  数据
 * @param {number} childrenId  唯一标识
 */
export const controlTreeParentNotChecked = (
  data: DataProps[],
  childrenId: number | string,
  checked: boolean
) => {
  // @ts-ignore
  const forFn = (arr: DataProps[], id: number | string) => {
    arr.forEach((item: DataProps) => {
      if (item.id === id) {
        item.checked = checked;
        controlTreeParentNotChecked(data, item.parent, checked);
      } else if (item.children.length > 0) {
        forFn(item.children, id);
      }
    });
  };
  forFn(data, childrenId);
  return data;
};

/**
 * @description 父级选中，子级也选中 ||  父级未选中，子级也未选中
 * @param {array} data  列表
 * @param {number | string} id  唯一标识
 * @param {boolean} checked  是否选中
 */
export const controlTreeChildrenChecked = (
  data: DataProps[],
  id: number | string,
  checked: boolean
) => {
  if (id && data && data.length > 0) {
    data.forEach((el: any) => {
      if (el.id === id) {
        if (!el.disabled) {
          el.checked = checked;
        }

        if (el.children) {
          el.children.forEach((child: any) => {
            controlTreeChildrenChecked(el.children, child.id, checked);
          });
        }
      } else {
        controlTreeChildrenChecked(el.children, id, checked);
      }
    });
  }
  return data;
};

/**
 * @description 子级未选中 ， 父级未选中
 * @param {array} data  列表
 * @param {number | string} childrenId  唯一标识
 */

export const controlTreeParentChecked = (data: any, childrenId: number) => {
  const forFn = (arr: any, id: any) => {
    arr.forEach((item: any) => {
      if (item.id === id) {
        item.checked = item.children.every((el: any) => {
          return el.checked;
        });

        controlTreeParentChecked(data, item.parent);
      } else if (item.children.length > 0) {
        forFn(item.children, id);
      }
    });
  };
  forFn(data, childrenId);
  return data;
};

/**
 * @description 父级选中，子级也选中 ||  父级未选中，子级也未选中
 * @param {array} data  列表
 * @param {number | string} id  唯一标识
 * @param {boolean} checked  是否选中
 */
export const controlTreeChildrenDisabled = (
  data: DataProps[],
  id: number | string
) => {
  if (id && data && data.length > 0) {
    data.forEach((el: any) => {
      if (el.id === id) {
        el.disabled = true;
        if (el.children) {
          el.children.forEach((child: any) => {
            controlTreeChildrenDisabled(el.children, child.id);
          });
        }
      } else {
        controlTreeChildrenDisabled(el.children, id);
      }
    });
  }
  return data;
};
