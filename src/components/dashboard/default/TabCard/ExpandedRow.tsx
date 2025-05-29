import { Tabs, Table, Alert } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { MismatchesItem, SigmaRule } from '../../../../types/default';
import { NetworkEvent } from '../../../../types/event_logs';
import {
  fetchMismatchesLog,
  fetchMismatchesRule,
} from '../../../../service/default';

const { TabPane } = Tabs;

const VERTICAL_TABLE_COLUMNS = [
  {
    title: 'Field',
    dataIndex: 'field',
    key: 'field',
    width: '30%',
    render: (text: string) => <strong>{text}</strong>,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    width: '70%',
    render: (value: unknown) => {
      if (typeof value === 'object' && value !== null)
        return JSON.stringify(value);
      return String(value);
    },
  },
];

export const ExpandedRow = ({ record }: { record: MismatchesItem }) => {
  const [ruleData, setRuleData] = useState<SigmaRule | null>(null);
  const [logData, setLogData] = useState<NetworkEvent | null>(null);
  const [loading, setLoading] = useState({
    rule: false,
    log: false,
  });
  const [error, setError] = useState({
    rule: null as ReactNode | null,
    log: null as ReactNode | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, rule: true }));
        const rule = await fetchMismatchesRule(record.rule.id);
        setRuleData(rule);
        setError((prev) => ({ ...prev, rule: null }));
      } catch (err) {
        console.error('Error fetching rule:', err);
        setError((prev) => ({
          ...prev,
          rule: err instanceof Error ? err.message : 'Failed to load rule data',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, rule: false }));
      }

      try {
        setLoading((prev) => ({ ...prev, log: true }));
        const log = await fetchMismatchesLog(record.log_id);
        setLogData(log);
        setError((prev) => ({ ...prev, log: null }));
      } catch (err) {
        console.error('Error fetching log:', err);
        setError((prev) => ({
          ...prev,
          log: err instanceof Error ? err.message : 'Failed to load log data',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, log: false }));
      }
    };

    fetchData();
  }, [record.rule.id, record.log_id]);

  const getRuleData = () => {
    if (!ruleData) return [];

    return [
      { field: 'Title', value: ruleData.title },
      { field: 'Description', value: ruleData.description },
      { field: 'Status', value: ruleData.status },
      { field: 'Level', value: ruleData.level },
      { field: 'Tags', value: ruleData.tags.join(' => ') },
      { field: 'References', value: ruleData.references.join(' => ') },
      { field: 'Author', value: ruleData.author },
      { field: 'Date', value: ruleData.date },
    ];
  };

  const getLogData = () => {
    if (!logData) return [];

    return [
      { field: 'Event ID', value: logData.EventId },
      { field: 'User', value: logData.Event?.User },
      { field: 'Image', value: logData.Event?.Image },
      { field: 'Company', value: logData.Event?.Company },
      { field: 'Command Line', value: logData.Event?.CommandLine },
      { field: 'Parent Image', value: logData.Event?.ParentImage },
      { field: 'Parent Command Line', value: logData.Event?.ParentCommandLine },
      { field: 'Original File Name', value: logData.Event?.OriginalFileName },
      { field: 'Integrity Level', value: logData.Event?.IntegrityLevel },
      {
        field: 'UTC Time',
        value: logData.Event?.UtcTime
          ? new Date(logData.Event.UtcTime).toLocaleString()
          : null,
      },
    ];
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Rule" key="1">
        {error.rule && <Alert message={error.rule} type="error" showIcon />}
        <Table
          columns={VERTICAL_TABLE_COLUMNS}
          dataSource={getRuleData()}
          pagination={false}
          bordered
          showHeader={false}
          rowKey="field"
          loading={loading.rule}
          locale={{ emptyText: loading.rule ? 'Loading...' : 'No data found' }}
        />
      </TabPane>
      <TabPane tab="Log" key="2">
        {error.log && <Alert message={error.log} type="error" showIcon />}
        <Table
          columns={VERTICAL_TABLE_COLUMNS}
          dataSource={getLogData()}
          pagination={false}
          bordered
          showHeader={false}
          rowKey="field"
          loading={loading.log}
          locale={{ emptyText: loading.log ? 'Loading...' : 'No data found' }}
        />
      </TabPane>
    </Tabs>
  );
};
