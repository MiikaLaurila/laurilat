import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { Editable, EditableType } from '../../types/EditablePost';
import { EditableHeading } from './EditableHeading';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import styled from '@emotion/styled';
import { Button } from '../form/Button';
import { deleteEditableFromPost, modifyEditableOfPost, setHiglightedEditable } from '../../store/editableSlice';
import deepmerge from 'deepmerge';
import { EditableHeading2 } from './EditableHeading2';

interface Props {
  editable: Editable;
}

const HighlightedEditable = styled('div')({
  outline: 'blue solid 1px',
  width: '100%',
  outlineOffset: '0.5rem',
  margin: '1rem 0rem',
});

const UnHighlightedEditable = styled('div')({
  ':hover': {
    cursor: 'pointer',
    outline: 'blue solid 1px',
    outlineOffset: '0.5rem',
    width: '100%',
    margin: '1rem 0rem',
  },
});

const EditableControls = styled('div')({
  marginTop: '1rem',
  display: 'flex',
  gap: '1rem',
});

export const EditableWrapper: React.FC<Props> = (props: Props) => {
  const editState = useAppSelector((state) => state.editableStore);
  const dispatch = useAppDispatch();

  const debounceTime = 500;
  let timeout: number | null = null;

  const onEditableModify = (content: string) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      const schema = deepmerge(defaultSchema, { attributes: { '*': ['style'] } });
      unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeSanitize, schema)
        .use(rehypeStringify)
        .process(content)
        .then((result) => {
          const newEditable = { ...props.editable };
          newEditable.content = result.value.toString();
          dispatch(modifyEditableOfPost(newEditable));
        });
    }, debounceTime);
  };

  const getEditable = () => {
    switch (props.editable.type) {
      case EditableType.HEADING:
        return (
          <EditableHeading
            editable={props.editable}
            highlighted={editState.highlightedEditable?.id === props.editable.id}
            onModify={onEditableModify}
          />
        );
      case EditableType.HEADING2:
        return (
          <EditableHeading2
            editable={props.editable}
            highlighted={editState.highlightedEditable?.id === props.editable.id}
            onModify={onEditableModify}
          />
        );
      default:
        return <span>not implemented</span>;
    }
  };

  const getEditableControls = () => {
    return (
      <EditableControls>
        <Button
          onClick={() => {
            dispatch(setHiglightedEditable(undefined));
          }}
        >
          Apply
        </Button>
        <Button
          onClick={() => {
            dispatch(deleteEditableFromPost(props.editable.id));
          }}
        >
          Delete
        </Button>
        <Button>Move Up</Button>
        <Button>Move Down</Button>
      </EditableControls>
    );
  };

  const getEditModeEditables = () => {
    if (editState.highlightedEditable?.id === props.editable.id) {
      return (
        <HighlightedEditable>
          {getEditable()}
          {getEditableControls()}
        </HighlightedEditable>
      );
    } else {
      return (
        <UnHighlightedEditable
          onClick={() => {
            dispatch(setHiglightedEditable(props.editable));
          }}
        >
          {getEditable()}
        </UnHighlightedEditable>
      );
    }
  };

  if (editState.editing) {
    return getEditModeEditables();
  } else return getEditable();
};
