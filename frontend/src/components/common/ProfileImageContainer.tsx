import styled from '@emotion/styled';
import { cssColors } from '../../style/values';

export const ProfileImageElement = styled('img')<{ size?: number }>((props) => ({
  width: props.size ? `${props.size}rem` : '10rem',
  height: props.size ? `${props.size}rem` : '10rem',
}));

export const ProfileImageContainer = styled('div')<{ hasImage: boolean; size?: number; clickable?: boolean }>(
  (props) => ({
    width: props.size ? `${props.size}rem` : '10rem',
    height: props.size ? `${props.size}rem` : '10rem',
    border: !props.hasImage ? `1px dashed ${cssColors.darkBorder}` : 'none',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      cursor: props.clickable ? 'pointer' : 'initial',
    },
  })
);
