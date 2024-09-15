import { Request, Response } from 'express';
export declare const createCredit: (req: Request, res: Response) => Promise<void>;
export declare const createUser: (req: Request, res: Response) => Promise<void>;
export declare const loginUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCredits: (req: Request, res: Response) => Promise<void>;
export declare const getCreditById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCredit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteCredit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
