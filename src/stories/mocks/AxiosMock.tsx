import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useEffect, useMemo } from 'react';

const AxiosMock = ({
    children,
    api,
    mock,
}: {
    children: JSX.Element;
    mock: (adapter: MockAdapter) => void;
    api: AxiosInstance;
}) => {
    const apiMock = useMemo(() => {
        return new MockAdapter(api);
    }, [api]);

    useEffect(() => {
        mock(apiMock);
        return () => {
            apiMock.reset();
        };
    }, [mock, apiMock]);
    return children;
};

export default AxiosMock;
