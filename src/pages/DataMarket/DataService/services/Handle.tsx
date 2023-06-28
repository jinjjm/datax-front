/**
 * 数据操作函数
 */
import { nanoid } from 'nanoid'
/**
 * 给每一行增加col_id
 * @param tableData 
 * @returns 
 */
const handleAddColumnId = function (tableData: any) {
    let newTableData: any[] = [];
    tableData.map((col: any) => {
        newTableData.push({
            ...col,
            col_id: nanoid(),
        })
    });
    // console.log(newTableData)
    return newTableData;
}
/**
 * 将数字转为字符串数组
 * @param tableData 
 * @returns 
 */
const handleTransforNum = function (tableData: any) {
    let newTableData: any[] = [];
    tableData.map((col: any) => {
        const { reqable, resable } = col;
        newTableData.push({
            ...col,
            reqable: reqable === 1 ? ['1'] : [],
            resable: resable === 1 ? ['1'] : [],
        })
    });
    // console.log(newTableData)
    return newTableData;
}
/**
 * 将字符串数组转为字符串
 * @param tableData 
 * @returns 
 */
export const handleTransforString = (tableData: any, name: string) => {
    let newTableData: any[] = [];
    if (name === "reqParams") {
        newTableData = tableData.map((col: any) => {
            const { nullable } = col;
            return {
                ...col,
                nullable: nullable?.length === 1 ? "1" : "0",
            }
        });
    }
    if (name === "fieldParams") {
        newTableData = tableData.map((col: any) => {
            const { reqable, resable } = col;
            return {
                ...col,
                reqable: reqable?.length === 1 ? "1" : "0",
                resable: resable?.length === 1 ? "1" : "0",
            }
        });
    }
    return newTableData;
}
/**
 * 处理api详情的返回参数
 * @param response 
 * @returns 
 */
export const handleAPIDetials = (response: any) => {
    /**
     * response中需要处理的表格有
     * executeConfig.fieldParams
     * reqParams
     * resParams
     */
    const { allow, deny, executeConfig, reqParams, resParams } = response;
    const { fieldParams } = executeConfig;
    // 判断黑名单还是白名单
    let allow_or_deny = deny ? "hei" : allow ? "bai" : "";
    return {
        ...response,
        allow_or_deny: allow_or_deny,
        executeConfig: {
            ...executeConfig,
            fieldParams: handleTransforNum(
                handleAddColumnId(fieldParams)
            ),
        },
        reqParams: handleAddColumnId(reqParams),
        resParams: handleAddColumnId(resParams),
    }
}
/**
 * 
 * 处理api树数据，变为树形组件可以使用的结构
 * @param data api树 数据
 * @param checkLeaf 叶子节点是否可以选中
 * @returns 
 */
export const handleTreeData = (data: [], checkLeaf: Boolean) => {
    //递归处理函数
    const handleDiGui = function (child: any) {
        let { apis, childrenMenu } = child;
        // 如果api数组和子目录数组为空则递归结束
        if (apis.length === 0 && childrenMenu.length === 0) return child;
        let children = childrenMenu.map((ch: any) => {
            return handleDiGui(ch);
        });
        // 将api数组添加至子目录数组，使其满足树形组件结构要求
        for (let api of apis) {
            children.push({
                ...api,
                menuName: api.apiName,
                isLeaf: true,
                parentId: child.id,
                disabled: !checkLeaf,
            });
        }
        return {
            ...child,
            childrenMenu: children,
        };
    }
    // js, map不能改变数组本身的内容，需要重新定义数组来接收
    let treedata = data?.map((leaf: any) => {
        return handleDiGui(leaf);
    });
    console.log(treedata)
    return treedata;
}
/**
 * 节点名字过长处理
 * @param value 
 * @param len 
 * @returns 
 */
export const ellipsis = (value: string, len: number) => {
    if (!value) return ''
    if (value.length > len) {
        return value.slice(0, len) + '...'
    }
    return value
}
/**
 * 页面标头
 * @param pageType 新建或id
 * @param item localStorage.getItem('isEdit')
 * @param theme 模块标识
 * @returns
 */
export const TitleAdapter = (pageType: any) => {
    if (pageType == 'new') {
      return '新建' ;
    } else  {
      return '查看详情';
    }
  };