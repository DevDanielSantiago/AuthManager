export interface ResponsePasswordResetRequestDto {
  _id: string;
  userId: string;
  token: string;
  expirationTime: Date;
  createdAt: Date;
}
