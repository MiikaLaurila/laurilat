import { EditableElement } from '../../types/EditableElement';
import { EditableImageMeta } from '../../types/EditablePost';
import { ImageElement, ImageElementContainer } from '../common/ImageContainer';
import { ImageSelector, SelectImage } from '../form/ImageSelector';

interface Props extends EditableElement {
  imageName: string;
  imageMeta: EditableImageMeta;
}

export const EditableImage: React.FC<Props> = (props: Props) => {
  if (props.highlighted) {
    return (
      <>
        <ImageSelector
          imageName={props.imageName}
          onImageUploaded={(name) => {
            props.onModify(name);
          }}
          onImageSizeChanged={(newSize) => {
            props.onModify(props.imageName, { size: newSize });
          }}
          imageMeta={props.imageMeta}
        />
      </>
    );
  } else {
    return (
      <ImageElementContainer size={props.imageMeta.size} hasImage={!!props.imageName}>
        {props.imageName && <ImageElement size={props.imageMeta.size} src={`/api/v1/image/${props.imageName}`} />}
        {!props.imageName && <SelectImage>No image</SelectImage>}
      </ImageElementContainer>
    );
  }
};
