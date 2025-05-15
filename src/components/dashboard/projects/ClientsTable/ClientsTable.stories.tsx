import type { Meta, StoryObj } from '@storybook/react';

import { ApplicationListTable } from './ClientsTable.tsx';

const meta = {
  title: 'Components/Dashboard/Projects/Clients',
  component: ApplicationListTable,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ApplicationListTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    deviceId: 1,
    style: { width: 600 },
  },
};
