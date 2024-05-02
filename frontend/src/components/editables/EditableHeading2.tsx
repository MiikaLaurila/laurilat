import { ContentHeader2 } from '../content/ContentHeader';
import { Editable } from '../../types/EditablePost';
import { EditTextArea } from './EditTextArea';

interface Props {
  editable: Editable;
  onModify: (content: string) => void;
  highlighted?: boolean;
}

export const EditableHeading2: React.FC<Props> = (props: Props) => {
  if (props.highlighted) {
    return (
      <>
        <ContentHeader2 dangerouslySetInnerHTML={{ __html: props.editable.content }} />
        <EditTextArea
          defaultValue={props.editable.content}
          onInput={(evt) => {
            props.onModify(evt.currentTarget.value);
          }}
        />
      </>
    );
  } else {
    return <ContentHeader2 dangerouslySetInnerHTML={{ __html: props.editable.content }} />;
  }
};
