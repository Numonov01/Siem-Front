import { Flex, Card } from 'antd';
import { PageHeader } from '../components';
import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { fetchProcessList } from '../service/process_list';
import { ProcessListData } from '../types/process_list';
import { ProcessTableTree } from '../components/dashboard/projects/ProjectsTables/ProcessTreeView';

export const AboutPage = () => {
  const [processes, setProcesses] = useState<ProcessListData[]>([]);

  useEffect(() => {
    // Demo uchun deviceId ni 2 deb olaylik
    const fetchProcesses = async () => {
      try {
        const res = await fetchProcessList('2');
        setProcesses(res);
      } catch (err) {
        console.error('Failed to load processes', err);
      }
    };
    fetchProcesses();
  }, []);

  return (
    <div>
      <Flex vertical gap="middle">
        <PageHeader
          title="About"
          breadcrumbs={[
            {
              title: (
                <>
                  <HomeOutlined />
                  <span>home</span>
                </>
              ),
              path: '/',
            },
            {
              title: (
                <>
                  <PieChartOutlined />
                  <span>dashboards</span>
                </>
              ),
              path: '/dashboards',
            },
            {
              title: 'about',
            },
          ]}
        />

        <Card title="Process Tree">
          <ProcessTableTree processes={processes} />
        </Card>
      </Flex>
    </div>
  );
};
