import styled from '@emotion/styled';

interface Props {
  title: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  id: string;
}

const Title = styled('label')({
  fontSize: '1rem',
  fontFamily: 'Arial, Sans-Serif',
  textTransform: 'uppercase',
  display: 'block',
});

const Input = styled('input')({
  fontSize: '1rem',
});

export const CheckboxInput: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <Title htmlFor={props.id}>{props.title}</Title>
      <Input type="checkbox" onChange={props.onChange} id={props.id} />
    </div>
  );
};
