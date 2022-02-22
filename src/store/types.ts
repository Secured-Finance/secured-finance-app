import store from '.';

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
