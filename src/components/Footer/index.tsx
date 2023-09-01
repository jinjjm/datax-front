import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Image } from 'antd';
import React from 'react';

import logo from './gm-logo.png'

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '河北工业大学-天津公路事业服务中心联合出品',
    // defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`} // 版权
      // copyright={false}
      links={[
        {
          key: 'tjgl',
          title: '天津公路事业发展服务中心',
          href: 'https://baike.baidu.com/item/%E5%A4%A9%E6%B4%A5%E5%B8%82%E5%85%AC%E8%B7%AF%E4%BA%8B%E4%B8%9A%E5%8F%91%E5%B1%95%E6%9C%8D%E5%8A%A1%E4%B8%AD%E5%BF%83',
          blankTarget: true,
        },
        {
          key: 'logo',
          title: <Image src={logo} preview={false} width={20}/>,
          href: 'https://jtys.tj.gov.cn/',
          blankTarget: true,
        },
        {
          key: 'hebut',
          title: '河北工业大学',
          href: 'https://www.hebut.edu.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
