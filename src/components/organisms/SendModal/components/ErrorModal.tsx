import React from 'react';
import {
    Modal,
    ModalActions,
    ModalTitle,
    ModalContent,
} from 'src/components/atoms';
import { Button } from 'src/components/common/Buttons';
import styled from 'styled-components';
import theme from 'src/theme';

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
                <Button outline onClick={onClose}>
                    Close
                </Button>
            </ModalActions>
        </Modal>
    );
};

const ContentBlock = styled.div`
    color: ${theme.colors.gray};
`;
