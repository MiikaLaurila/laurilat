import styled from '@emotion/styled';
import { Oval } from 'react-loader-spinner';
import { cssColors } from '../../style/values';

interface Props {
  loadingText?: string;
  size?: number;
}
const LoadingSpinnerContainer = styled('div')<{ size?: number }>((props) => ({
  height: props.size ? `${props.size}rem` : '5rem',
  display: 'inline-flex',
  flexDirection: 'column',
  alignContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
}));
const LoadingSpinnerText = styled('span')({});

export const LoadingSpinner: React.FC<Props> = (props: Props) => {
  return (
    <LoadingSpinnerContainer>
      <LoadingSpinnerText>{props.loadingText ?? 'Loading...'}</LoadingSpinnerText>
      <Oval
        visible
        height={props.size ? `${props.size / 1.5}rem` : '3.33rem'}
        width={props.size ? `${props.size / 1.5}rem` : '3.33rem'}
        color={cssColors.menuHoverText}
        secondaryColor={cssColors.menuClick}
      />
    </LoadingSpinnerContainer>
  );
};
