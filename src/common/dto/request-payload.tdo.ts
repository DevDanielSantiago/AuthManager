export interface RequestPayloadDTO {
  user: {
    _id: string;
    permissions: string[];
  };
}
