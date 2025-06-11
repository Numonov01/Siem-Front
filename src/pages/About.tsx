import { Alert, Card, Flex } from 'antd';
// import { PageHeader } from '../components';
// import {
//   BranchesOutlined,
//   HomeOutlined,
//   PieChartOutlined,
// } from '@ant-design/icons';
import { ReactNode, useEffect, useState } from 'react';
import { fetchProcessList } from '../service/process_list';
import { ProcessListData } from '../types/process_list';
import { useParams } from 'react-router-dom';
import { ProcessTreeBox } from '../components/dashboard/projects/ProjectsTables/TreeView';

export const AboutPage = () => {
  const [processes, setProcesses] = useState<ProcessListData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ReactNode>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchProcesses = async () => {
      setLoading(true);
      try {
        const res = await fetchProcessList(id);
        setProcesses(res);
        setError(null);
      } catch (err) {
        console.error('Failed to load processes', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load processes'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProcesses();
  }, [id]);

  return (
    <div>
      <Flex vertical gap="middle">
        {/* <PageHeader
          icon={<BranchesOutlined />}
          title="Process Tree"
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
              title: 'tree',
            },
          ]}
        /> */}

        {error ? (
          <Alert
            message="Error"
            description={error.toString()}
            type="error"
            showIcon
          />
        ) : (
          <Card
            title="Process Tree View"
            style={{ borderRadius: 8, backgroundColor: '#ffff' }}
            loading={loading}
          >
            <ProcessTreeBox processes={processes} />
          </Card>
        )}
        {/* {error ? (
          <Alert
            message="Error"
            description={error.toString()}
            type="error"
            showIcon
          />
        ) : (
          <ProcessTableTree processes={processes} loading={loading} />
        )} */}
      </Flex>
    </div>
  );
};
