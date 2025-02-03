declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Request {
      userId: string;
      sessionId: string;
    }
  }
}
export {};
