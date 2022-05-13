import { SendFormStore } from './types';
export * from './actions';
export { default } from './reducer';
export type { SendFormStore } from './types';

export const sendFormSelector = (state: { sendForm: SendFormStore }) =>
    state.sendForm;
