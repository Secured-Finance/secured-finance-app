/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import Button from './index'

export default {
  title: 'form/Button',
  component: Button,
}

export const Default = () => <Button>Press me!</Button>

const Template = (args: any) => <Button {...args} />

export const LargeBlue = Template.bind({})
LargeBlue.args = {
  size: 'lg',
  variant: 'blue',
  children: 'Large',
}

export const LinkButton = Template.bind({})
LinkButton.args = {
  to: '/some/internal/link',
  text: 'Internal Link',
}

export const SmallSizeButton = Template.bind({})
SmallSizeButton.args = {
  size: 'sm',
  variant: 'orange',
  children: 'Button size sm',
}

export const MiddleSizeButton = Template.bind({})
MiddleSizeButton.args = {
  size: 'md',
  variant: 'orange',
  children: 'Button size sm',
}
