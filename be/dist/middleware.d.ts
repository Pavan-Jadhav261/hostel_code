import { Request, Response, NextFunction } from "express";
export interface auhtReq extends Request {
    userId?: number;
}
export declare function auth(req: auhtReq, res: Response, next: NextFunction): Promise<void>;
export declare function adminAuth(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=middleware.d.ts.map