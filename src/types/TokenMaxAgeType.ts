export type TokenMaxAgeType = {
  google_token?: number;
  access_token: number;
  refresh_token: number;
  [x: string]: number | undefined;
};
