import styled from '@emotion/styled';
import { cssColors } from '../../style/values';

export const ImageElement = styled('img')<{ size?: number; hidden?: boolean }>((props) => ({
  height: props.size ? `${props.size}rem` : '10rem',
  display: props.hidden ? 'none' : 'unset',
}));

export const ImageElementContainer = styled('div')<{
  hasImage: boolean;
  size?: number;
  clickable?: boolean;
}>((props) => ({
  width: !props.hasImage ? `${props.size}rem` : 'unset',
  height: props.size ? `${props.size}rem` : '10rem',
  border: !props.hasImage ? `1px dashed ${cssColors.darkBorder}` : 'none',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    cursor: props.clickable ? 'pointer' : 'initial',
  },
  marginTop: '1rem',
}));
