import styled from '@emotion/styled';
import { cssColors } from '../../style/values';
import { ContentHeader1 } from '../content/ContentHeader';
import { ContentParagraph } from '../content/ContentParagraph';
import { Button } from '../form/Button';
import { createPortal } from 'react-dom';

const ModalBackground = styled('div')({
  position: 'fixed',
  height: '100vh',
  width: '100vw',
  top: 0,
  left: 0,
  fontFamily: 'Roboto',
  backgroundColor: cssColors.darkTransparent20,
  display: 'flex',
  justifyContent: 'center',
});

const ModalContent = styled('div')({
  border: `1px solid ${cssColors.border}`,
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: cssColors.innerBody,
  padding: '2rem',
  flexGrow: 0,
  alignSelf: 'center',
});

const ButtonContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
  paddingTop: '1rem',
});

interface Props {
  title: string;
  content: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<Props> = (props: Props) => {
  if (!props.open) return null;
  return createPortal(
    <ModalBackground>
      <ModalContent>
        <ContentHeader1>{props.title}</ContentHeader1>
        <ContentParagraph>{props.content}</ContentParagraph>
        <ButtonContainer>
          <Button onClick={props.onConfirm}>Confirm</Button>
          <Button onClick={props.onCancel}>Cancel</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>,
    document.body
  );
};
