import { ContentHeader1, ContentHeader2, ContentHeader3 } from '../content/ContentHeader';
import { EditTextArea } from './EditTextArea';
import { EditableElement } from '../../types/EditableElement';

interface Props extends EditableElement {
  type: 1 | 2 | 3;
}

export const EditableHeading: React.FC<Props> = (props: Props) => {
  const getHeader = () => {
    switch (props.type) {
      case 1:
        return <ContentHeader1 dangerouslySetInnerHTML={{ __html: props.editable.content }} />;
      case 2:
        return <ContentHeader2 dangerouslySetInnerHTML={{ __html: props.editable.content }} />;
      case 3:
        return <ContentHeader3 dangerouslySetInnerHTML={{ __html: props.editable.content }} />;
    }
  };

  if (props.highlighted) {
    return (
      <>
        {getHeader()}
        <EditTextArea
          defaultValue={props.editable.content}
          onInput={(evt) => {
            props.onModify(evt.currentTarget.value);
          }}
        />
      </>
    );
  } else {
    return getHeader();
  }
};
