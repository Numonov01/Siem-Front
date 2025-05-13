import type { Meta, StoryObj } from '@storybook/react';

import { DeviceListTable } from './ProjectsTable.tsx';

const meta = {
  title: 'Components/Dashboard/Projects/Projects table',
  component: DeviceListTable,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DeviceListTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
    style: { width: 1000 },
  },
};
