import { useState, useRef } from 'react';
import {
  HomeOutlined,
  PieChartOutlined,
  MessageOutlined,
  UserOutlined,
  SendOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { Avatar, Input, Button, Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { PageHeader } from '../../components';

const { TextArea } = Input;

interface ChatMessage {
  id: number;
  sender: 'You' | 'Support';
  text: string;
  time: string;
  files?: UploadFile[];
}

export const ChatDashboardPage = () => {
  const [message, setMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('1');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'Support',
      text: 'Xush kelibsiz! Sizga qanday yordam bera olaman?',
      time: '10:30',
    },
    {
      id: 2,
      sender: 'You',
      text: 'Yangi buyurtma berishim kerak',
      time: '10:32',
    },
    {
      id: 3,
      sender: 'Support',
      text: 'Albatta, qanday mahsulot buyurtma qilmoqchisiz?',
      time: '10:33',
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim() || fileList.length > 0) {
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        files: [...fileList],
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      setFileList([]);
    }
  };

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <MessageOutlined />
          Chatlar
        </span>
      ),
      children: (
        <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Card
              title="Assistant AI"
              bordered={false}
              style={{ flex: 1, overflow: 'auto', backgroundColor: '#fff' }}
              bodyStyle={{ padding: '16px 0' }}
            >
              <div style={{ padding: '0 16px' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection:
                        msg.sender === 'You' ? 'row-reverse' : 'row',
                      marginBottom: 16,
                    }}
                  >
                    <Avatar
                      style={{
                        margin:
                          msg.sender === 'You' ? '0 0 0 8px' : '0 8px 0 0',
                      }}
                      icon={<UserOutlined />}
                    />
                    <div>
                      {msg.text && (
                        <div
                          style={{
                            background:
                              msg.sender === 'You' ? '#1890ff' : '#f0f0f0',
                            color: msg.sender === 'You' ? '#fff' : '#000',
                            padding: '8px 12px',
                            borderRadius: 8,
                            marginBottom: msg.files?.length ? 8 : 0,
                          }}
                        >
                          {msg.text}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 11,
                          color: '#999',
                          textAlign: msg.sender === 'You' ? 'right' : 'left',
                          marginTop: 4,
                        }}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextArea
                  ref={textAreaRef}
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Xabar yozing..."
                  style={{ flex: 1, marginRight: 8 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  style={{ height: 'auto' }}
                  disabled={!message.trim() && fileList.length === 0}
                />
              </div>
            </div>

            {/* <div style={{ padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TextArea
                  ref={textAreaRef}
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Xabar yozing..."
                  style={{
                    flex: 1,
                    paddingRight: 50,
                  }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  style={{
                    position: 'absolute',
                    right: 8,
                    height: 'auto',
                    zIndex: 1,
                  }}
                  disabled={!message.trim() && fileList.length === 0}
                />
              </div>
            </div> */}
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <SettingOutlined />
          Sozlamalar
        </span>
      ),
      children: <div style={{ padding: 16 }}>Chat sozlamalari bu yerda</div>,
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Chat Dashboard</title>
      </Helmet>
      <PageHeader
        title="Chat Dashboard"
        breadcrumbs={[
          {
            title: (
              <>
                <HomeOutlined />
                <span>Home</span>
              </>
            ),
            path: '/',
          },
          {
            title: (
              <>
                <PieChartOutlined />
                <span>Dashboards</span>
              </>
            ),
          },
          {
            title: 'Chat',
          },
        ]}
      />
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        // style={{ margin: '0 16px' }}
      />
    </div>
  );
};
