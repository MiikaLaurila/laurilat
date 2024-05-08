import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { Editable, EditableImageMeta, EditableType } from '../../types/EditablePost';
import { EditableHeading } from './EditableHeading';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import styled from '@emotion/styled';
import { Button } from '../form/Button';
import {
  deleteEditableFromPost,
  modifyEditableOfPost,
  modifyTitleOfPost,
  moveEditableOfPost,
  setHiglightedEditable,
} from '../../store/editableSlice';
import deepmerge from 'deepmerge';
import { cssColors } from '../../style/values';
import { EditableParagraph } from './EditableParagraph';
import { EditableImage } from './EditableImage';

interface Props {
  editable: Editable;
}

const HighlightedEditable = styled('div')({
  outline: `${cssColors.darkBorder} 1px solid`,
  width: '100%',
  outlineOffset: '0.5rem',
  margin: '1rem 0rem',
});

const UnHighlightedEditable = styled('div')({
  ':hover': {
    cursor: 'pointer',
    backgroundColor: cssColors.whiteTransparent20,
    width: '100%',
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

  const onEditableModify = (content: string, meta?: Record<string, unknown>) => {
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
          if (meta) {
            newEditable.meta = meta;
          }
          if (props.editable.type === EditableType.TITLE) {
            dispatch(modifyTitleOfPost(newEditable));
          } else {
            dispatch(modifyEditableOfPost(newEditable));
          }
        });
    }, debounceTime);
  };

  const getEditable = () => {
    const defaultProps = {
      editable: props.editable,
      highlighted: editState.highlightedEditable?.id === props.editable.id,
      onModify: onEditableModify,
    };

    switch (props.editable.type) {
      case EditableType.TITLE:
        return <EditableHeading {...defaultProps} type={1} />;
      case EditableType.HEADING2:
        return <EditableHeading {...defaultProps} type={2} />;
      case EditableType.HEADING3:
        return <EditableHeading {...defaultProps} type={3} />;
      case EditableType.PARAGRAPH:
        return <EditableParagraph {...defaultProps} />;
      case EditableType.IMAGE:
        return (
          <EditableImage
            {...defaultProps}
            imageName={props.editable.content}
            imageMeta={props.editable.meta as EditableImageMeta}
          />
        );
      default:
        return <span>not implemented</span>;
    }
  };

  const onFinishEditingClick = () => {
    dispatch(setHiglightedEditable(undefined));
  };

  const onDeleteClick = () => {
    dispatch(deleteEditableFromPost(props.editable.id));
  };

  const onMoveUpClick = () => {
    dispatch(moveEditableOfPost({ editable: props.editable, direction: 'up' }));
  };

  const onMoveDownClick = () => {
    dispatch(moveEditableOfPost({ editable: props.editable, direction: 'down' }));
  };

  const getEditableControls = () => {
    return (
      <EditableControls>
        <Button onClick={onFinishEditingClick}>Finish editing</Button>
        {props.editable.type !== EditableType.TITLE && (
          <>
            <Button onClick={onDeleteClick}>Delete</Button>
            <Button onClick={onMoveUpClick}>Move Up</Button>
            <Button onClick={onMoveDownClick}>Move Down</Button>
          </>
        )}
      </EditableControls>
    );
  };

  const onUnHighlightedEditableClick = () => {
    dispatch(setHiglightedEditable(props.editable));
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
      return <UnHighlightedEditable onClick={onUnHighlightedEditableClick}>{getEditable()}</UnHighlightedEditable>;
    }
  };

  if (editState.editing) {
    return getEditModeEditables();
  } else return getEditable();
};
