import type { Meta, StoryObj } from '@storybook/react';

import Calendar from '../index';

const meta = {
  title: 'Calendar/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    apiKey: { control: 'text' },
    calendars: { control: 'object' },
    language: { control: 'text' },
    styles: { control: 'object' },
  }
} as Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const DefaultCalendar: Story = {
  args: {
    calendars: [{ calendarId: "89f25550f7faf78d9d470bd0c4b23b8ba28f6b78821af4d60ff47facc1a715b7@group.calendar.google.com" }]
  }
};