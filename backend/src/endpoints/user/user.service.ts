import { LoginUser, NewUser, UserModel } from './user.schema.js';
import { comparePassword, hashPassword } from './helpers/passwords.js';
import { getMinioClient, minioBuckets } from '../../minio/initializeMinio.js';

const systemHasUsers = async () => {
  return (await UserModel.findOne().lean()) !== null;
};

const createUser = async (userData: NewUser) => {
  const newUser = await UserModel.create(userData);
  newUser.password = await hashPassword(newUser.password);
  const savedUser = await newUser.save();
  return savedUser.toObject();
};

const deleteUser = async (username: string) => {
  const foundUser = await UserModel.findOne({ username });
  if (foundUser) {
    await foundUser.deleteOne();
    return true;
  }
  return false;
};

const loginUser = async (loginUser: LoginUser) => {
  const foundUser = await UserModel.findOne({ username: loginUser.username });
  if (foundUser) {
    const correctPassword = await comparePassword(loginUser.password, foundUser.password);
    if (correctPassword) {
      return foundUser.toObject();
    }
  }
  return null;
};

const getUserInfo = async (username?: string) => {
  if (!username) return null;
  const foundUser = await UserModel.findOne({ username });
  if (foundUser) return foundUser.toObject();
  return null;
};

const updateProfileImage = async (username?: string, file?: Express.Multer.File) => {
  if (!username || !file) return null;
  const foundUser = await UserModel.findOne({ username });
  if (foundUser) {
    const minioClient = getMinioClient();
    await minioClient.putObject(minioBuckets.profileImages, file.originalname, file.buffer, file.size);
    foundUser.profileImage = file.originalname;
    const savedUser = await foundUser.save();
    return savedUser.toObject();
  }
  return null;
};

const deleteProfileImage = async (username?: string) => {
  if (!username) return null;
  const foundUser = await UserModel.findOne({ username });
  if (foundUser) {
    foundUser.profileImage = '';
    const savedUser = await foundUser.save();
    return savedUser.toObject();
  }
  return null;
};

const getProfileImage = async (username?: string) => {
  if (!username) return null;
  const foundUser = await UserModel.findOne({ username }).lean({ versionKey: false });
  if (foundUser) {
    const minioClient = getMinioClient();
    return minioClient.getObject(minioBuckets.profileImages, foundUser.profileImage);
  }
  return null;
};

export const UserService = {
  systemHasUsers,
  createUser,
  deleteUser,
  loginUser,
  getUserInfo,
  updateProfileImage,
  deleteProfileImage,
  getProfileImage,
};
