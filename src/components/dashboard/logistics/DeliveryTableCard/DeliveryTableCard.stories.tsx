import type { Meta, StoryObj } from '@storybook/react';

import { DeliveryTableCard } from './DeliveryTableCard.tsx';

const meta = {
  title: 'Components/Dashboard/Logistics/Delivery/Table',
  component: DeliveryTableCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeliveryTableCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    style: { width: 1000 },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    style: { width: 1000 },
  },
};

export const Error: Story = {
  args: {
    style: { width: 1000 },
  },
};
