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
 * 将数字转为字符串
 * @param tableData 
 * @returns 
 */
const handleTransforNum = function (tableData: any) {
    let newTableData: any[] = [];
    tableData.map((col: any) => {
        const { reqable, resable } = col;
        newTableData.push({
            ...col,
            reqable: reqable === 1 ? "1" : "0",
            resable: resable === 1 ? "1" : "0",
        })
    });
    // console.log(newTableData)
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
    const { executeConfig, reqParams, resParams } = response;
    const { fieldParams } = executeConfig;
    return {
        ...response,
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