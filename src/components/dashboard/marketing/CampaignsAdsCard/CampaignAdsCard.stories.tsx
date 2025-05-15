import type { Meta, StoryObj } from '@storybook/react';

import { CampaignsAdsCard } from './CampaignsAdsCard.tsx';

const meta = {
  title: 'Components/Dashboard/Marketing/Campaigns/Ads stats',
  component: CampaignsAdsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CampaignsAdsCard>;

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
    error: 'Error loading items',
    style: { width: 1000 },
  },
};
