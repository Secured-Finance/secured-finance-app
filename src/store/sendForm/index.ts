import { SendFormStore } from './types';
export type { SendFormStore } from './types';
export { default } from './reducer';
export * from './actions';

export const sendFormSelector = (state: { sendForm: SendFormStore }) =>
    state.sendForm;
