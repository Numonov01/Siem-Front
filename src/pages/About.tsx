import { Flex } from 'antd';
import { PageHeader } from '../components';
import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { fetchProcessList } from '../service/process_list';
import { ProcessListData } from '../types/process_list';
import { ProcessTableTree } from '../components/dashboard/projects/ProjectsTables/ProcessTreeView';
import { useParams } from 'react-router-dom';

export const AboutPage = () => {
  const [processes, setProcesses] = useState<ProcessListData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchProcesses = async () => {
      setLoading(true);
      try {
        const res = await fetchProcessList(id);
        setProcesses(res);
      } catch (err) {
        console.error('Failed to load processes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProcesses();
  }, [id]);

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

        <ProcessTableTree processes={processes} loading={loading} />
      </Flex>
    </div>
  );
};
