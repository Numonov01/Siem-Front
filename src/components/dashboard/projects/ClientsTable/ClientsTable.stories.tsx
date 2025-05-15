import type { Meta, StoryObj } from '@storybook/react';
import ClientsData from '../../../../../public/mocks/Clients.json';

import { ClientsTable } from './ClientsTable.tsx';

const meta = {
  title: 'Components/Dashboard/Projects/Clients',
  component: ClientsTable,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ClientsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dataSource: ClientsData.slice(0, 10).map((client: any) => ({
      ...client,
      id: client.client_id,
      title: `${client.title} ${client.title}`,
    })),
    style: { width: 600 },
  },
};
