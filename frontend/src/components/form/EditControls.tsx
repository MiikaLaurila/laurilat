import styled from '@emotion/styled';
import { cssWidths, cssColors } from '../../style/values';

export const EditControlsDisabled = styled('div')({
  display: 'flex',
  gap: '1rem',
  position: 'fixed',
  bottom: '0rem',
  left: '50%',
  transform: `translate(calc(-100% + calc(${cssWidths.innerBody / 2}rem - 8px)), -50%)`,
});

export const EditControlsEnabled = styled('div')<{ level?: number }>((props) => ({
  display: 'flex',
  height: '5rem',
  width: '100%',
  backgroundColor: cssColors.menuHover,
  borderTop: `1px solid ${cssColors.darkBorder}`,
  gap: '1rem',
  position: 'fixed',
  bottom: props.level ? `${props.level * 5}rem` : '0rem',
  left: 0,
  padding: '0rem 2rem',
  alignItems: 'center',
}));

export const EditControlsCluster = styled('div')({
  display: 'flex',
  gap: '0.5rem',
  height: '5rem',
  padding: '1.5rem 0rem',
  paddingRight: '1rem',
  borderRight: '1px solid black',
});
