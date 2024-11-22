export interface ResponseUserDto {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: {
    _id: string;
    name: string;
  };
}
