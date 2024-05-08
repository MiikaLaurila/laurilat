import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { FormContainer } from './FormContainer';
import { ImageElement, ImageElementContainer } from '../common/ImageContainer';
import { EditableImageMeta } from '../../types/EditablePost';
import { TextInput } from './TextInput';
import { useUploadImageMutation } from '../../store/imageApi';

interface Props {
  imageName: string;
  imageMeta: EditableImageMeta;
  onImageUploaded: (imageUrl: string) => void;
  onImageSizeChanged: (newSize: number) => void;
}

export const SelectImage = styled('div')({
  width: '100%',
  textAlign: 'center',
});

export const ImageSelector: React.FC<Props> = (props: Props) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const imageSelectionRef = useRef<HTMLInputElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [uploadImageTrigger] = useUploadImageMutation();

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        if (imageRef.current) {
          setHasImage(imageRef.current.width > 0 && imageRef.current.height > 0);
        }
      };
    }
  }, [imageRef, props.imageName]);

  const onImageClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    if (imageSelectionRef.current) {
      imageSelectionRef.current.click();
    }
  };

  const onImageSelected = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.files && evt.currentTarget.files.length === 1) {
      setImageSelected(true);
      const file = evt.currentTarget.files[0];
      const fr = new FileReader();
      fr.onload = function () {
        if (previewImageRef.current && typeof fr.result === 'string') {
          previewImageRef.current.src = fr.result;
        }
      };
      fr.readAsDataURL(file);
    }
  };

  const uploadImage = () => {
    if (imageSelectionRef.current?.files && imageSelectionRef.current.files.length === 1) {
      const file = imageSelectionRef.current.files[0];
      uploadImageTrigger(file).then((res) => {
        if ('data' in res) {
          props.onImageUploaded(res.data);
          setImageSelected(false);
        } else {
          console.error(res);
        }
      });
    }
  };

  return (
    <FormContainer>
      <ImageElementContainer
        hasImage={hasImage || imageSelected}
        onClick={onImageClick}
        size={props.imageMeta.size}
        clickable={true}
      >
        {props.imageName && !imageSelected && (
          <ImageElement size={props.imageMeta.size} ref={imageRef} src={`/api/v1/image/${props.imageName}`} />
        )}
        {imageSelected && <ImageElement size={props.imageMeta.size} ref={previewImageRef} />}
        {!props.imageName && !imageSelected && <SelectImage>Click to select image</SelectImage>}
      </ImageElementContainer>

      <FormContainer>
        <TextInput
          title="Image size (px)"
          defaultText={(props.imageMeta.size * 10).toString()}
          onInput={(evt) => {
            const parsedNumber = parseFloat(evt.currentTarget.value);
            if (!isNaN(parsedNumber)) {
              props.onImageSizeChanged(parsedNumber / 10);
            }
          }}
        />
        {imageSelected && (
          <Button width={15} onClick={uploadImage}>
            Save selected image
          </Button>
        )}
      </FormContainer>

      <input
        type="file"
        accept="image/png, image/jpeg"
        ref={imageSelectionRef}
        onChange={onImageSelected}
        style={{ visibility: 'hidden' }}
      />
    </FormContainer>
  );
};
