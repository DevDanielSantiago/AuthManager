export interface ResponsePasswordResetRequestDto {
  _id: string;
  userId: string;
  resetToken: string;
  tokenExpiration: Date;
  createdAt: Date;
}
