export interface ResponseEmailChangeRequestDto {
  _id: string;
  userId: string;
  newEmail: string;
  token: string;
  tokenExpiration: Date;
  createdAt: Date;
}
