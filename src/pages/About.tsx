import { Alert, Card, Flex, Button } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { fetchProcessList } from '../service/process_list';
import { ProcessListData } from '../types/process_list';
import { useParams } from 'react-router-dom';
import { ProcessTreeBox } from '../components/dashboard/projects/ProjectsTables/TreeView';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import ButtonGroup from 'antd/es/button/button-group';

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
            extra={
              <ButtonGroup>
                <Button
                  icon={<ZoomInOutlined />}
                  onClick={() =>
                    document
                      .querySelector('.curved-tree-content')
                      ?.dispatchEvent(new CustomEvent('zoom', { detail: 'in' }))
                  }
                />
                <Button
                  icon={<ZoomOutOutlined />}
                  onClick={() =>
                    document
                      .querySelector('.curved-tree-content')
                      ?.dispatchEvent(
                        new CustomEvent('zoom', { detail: 'out' })
                      )
                  }
                />
              </ButtonGroup>
            }
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
