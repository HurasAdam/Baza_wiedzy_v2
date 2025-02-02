export interface ICreateProductRequest {
  name: string;
  labelColor: string;
  banner?: string;
}

interface ICreateProductParams {
  request: ICreateProductRequest;
  userId: string; // userId to string
}
