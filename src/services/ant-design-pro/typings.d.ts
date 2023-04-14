// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type ApiList = {
    id: string;
    apiName: string;
    apiVersion: string;
    apiUrl: string;
    reqMethod: string;
    resType: string;
    deny?: any;
    allow?: any;
    rateLimit?: any;
    executeConfig?: any;
    reqParams?: any;
    resParams?: any;
    status: string;
    createTime?: any;
    remark?: any;
  };
  type APIZiDuanTableType = {
    columnName: string;
    dataType: string;
    dataLength: number;
    dataPrecision?: any;
    dataScale?: any;
    columnKey: string;
    columnNullable: string;
    columnPosition: number;
    dataDefault?: any;
    columnComment: string;
    reqable?: any;
    resable: string;
  };
  type reqParamsColumns = {
    nullable: string;
    paramName: string;
    paramType: string;
    whereType: string;
    defaultValue: string;
    exampleValue: string;
    paramComment: string;
  };
  type resParamsColumns = {
    dataType: string;
    fieldName: string;
    exampleValue: string;
    fieldComment: string;
    fieldAliasName?: any;
  };
}
