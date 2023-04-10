import { PageContainer, ProCard } from '@ant-design/pro-components';

import DetailsTable from './components/DetailsTable';
import TreeData from './components/TreeData';

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
  );
};
