import { Story, Meta } from '@storybook/react';
import { Title, Subtitle, Headline, Text } from 'src/components/typography';
import cm from './index.module.scss';

export default {
    title: 'Typography/Text',
} as Meta;

export const Typography: Story = () => (
    <div className={cm.elementsContainer}>
        <Headline>Headline</Headline>
        <Title>Title</Title>
        <Subtitle>Subtitle</Subtitle>
        <Text>Text</Text>
        <Text bold>Text bold</Text>
    </div>
);
