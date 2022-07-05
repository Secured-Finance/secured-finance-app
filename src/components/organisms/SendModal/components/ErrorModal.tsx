import React from 'react';
import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from 'src/components/atoms';
import theme from 'src/theme';
import styled from 'styled-components';

interface IErrorModal {
    title?: string;
    text?: string | HTMLDivElement;
    onClose: () => void;
}

export const ErrorModal: React.FC<IErrorModal> = ({
    title = 'Error',
    text = 'Error',
    onClose,
}) => {
    return (
        <Modal>
            <ModalTitle text={title} />
            <ModalContent>
                <ContentBlock>{text}</ContentBlock>
            </ModalContent>
            <ModalActions>
                <Button onClick={onClose}>Close</Button>
            </ModalActions>
        </Modal>
    );
};

const ContentBlock = styled.div`
    color: ${theme.colors.gray};
`;
