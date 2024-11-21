export interface ResponseEmailChangeRequestDto {
  _id: string;
  userId: string;
  newEmail: string;
  token: string;
  expirationTime: Date;
  clientIp: string;
  createdAt: Date;
}
