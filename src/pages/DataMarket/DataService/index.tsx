import React, { useMemo, useState } from 'react';
import {
    PageContainer,
    ProCard,
} from '@ant-design/pro-components';

import TreeData from './components/TreeData'
import DetailsTable from './components/DetailsTable';

export default () => {

    return (
        <PageContainer>
            <ProCard split="vertical">
                <ProCard title="数据源&表" colSpan="20%">
                    <TreeData />
                </ProCard>
                <ProCard headerBordered>
                    <DetailsTable />
                </ProCard>
            </ProCard>
        </PageContainer>
    )
}