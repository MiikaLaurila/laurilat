import { EditTextArea } from './EditTextArea';
import { EditableElement } from '../../types/EditableElement';
import { ContentParagraph } from '../content/ContentParagraph';

export const EditableParagraph: React.FC<EditableElement> = (props: EditableElement) => {
  if (props.highlighted) {
    return (
      <>
        <ContentParagraph dangerouslySetInnerHTML={{ __html: props.editable.content }} />
        <EditTextArea
          defaultValue={props.editable.content}
          onInput={(evt) => {
            props.onModify(evt.currentTarget.value);
          }}
        />
      </>
    );
  } else {
    return <ContentParagraph dangerouslySetInnerHTML={{ __html: props.editable.content }} />;
  }
};
