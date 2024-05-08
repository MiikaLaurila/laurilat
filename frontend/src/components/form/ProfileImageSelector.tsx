import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { User } from '../../types/User';
import { useDeleteProfileImageMutation, useUploadProfileImageMutation } from '../../store/userApi';
import { FormContainer } from './FormContainer';
import { ProfileImageContainer, ProfileImageElement } from '../common/ProfileImageContainer';

interface Props {
  currentUser: User;
}

const SelectImage = styled('div')({
  width: '100%',
  textAlign: 'center',
});

export const ProfileImageSelector: React.FC<Props> = (props: Props) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const imageSelectionRef = useRef<HTMLInputElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [triggerUpload] = useUploadProfileImageMutation();
  const [triggerDelete] = useDeleteProfileImageMutation();

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        if (imageRef.current) {
          setHasImage(imageRef.current.width > 0 && imageRef.current.height > 0);
        }
      };
    }
  }, [imageRef, props.currentUser]);

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
      triggerUpload(file).then(() => {
        setImageSelected(false);
      });
    }
  };

  const deleteImage = () => {
    triggerDelete().then(() => {
      setHasImage(false);
    });
  };

  return (
    <FormContainer>
      <ProfileImageContainer hasImage={hasImage || imageSelected} onClick={onImageClick}>
        {props.currentUser.profileImage && !imageSelected && (
          <ProfileImageElement
            ref={imageRef}
            src={`/api/v1/user/image/${props.currentUser.username}?${props.currentUser.profileImage}`}
          />
        )}
        {imageSelected && <ProfileImageElement ref={previewImageRef} />}
        {!props.currentUser.profileImage && !imageSelected && <SelectImage>Upload profile picture</SelectImage>}
      </ProfileImageContainer>
      {imageSelected && (
        <Button width={10} onClick={uploadImage}>
          Upload image
        </Button>
      )}
      {!imageSelected && props.currentUser.profileImage && (
        <Button width={10} onClick={deleteImage}>
          Remove image
        </Button>
      )}
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
