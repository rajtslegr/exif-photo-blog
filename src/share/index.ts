import { Photo } from '@/photo';
import { PhotoSetAttributes, PhotoSetCategory } from '@/photo/set';
import {
  absolutePathForCameraImage,
  absolutePathForFilmSimulationImage,
  absolutePathForFocalLengthImage,
  absolutePathForPhotoImage,
  absolutePathForTagImage,
} from '@/app/paths';

export type ShareModalProps = Omit<PhotoSetAttributes, 'photos'> & {
  photo?: Photo
  photos?: Photo[]
} & PhotoSetCategory;

export const getSharePathFromShareModalProps = ({
  photo,
  tag,
  camera,
  simulation,
  focal,
}: ShareModalProps) => {
  if (photo) {
    return absolutePathForPhotoImage(photo);
  }
  if (tag) {
    return absolutePathForTagImage(tag);
  }
  if (camera) {
    return absolutePathForCameraImage(camera);
  }
  if (simulation) {
    return absolutePathForFilmSimulationImage(simulation);
  }
  if (focal) {
    return absolutePathForFocalLengthImage(focal);
  }
};
