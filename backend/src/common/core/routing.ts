// ------------------------------
// TODO IN FUTURE (10.05.2025 22:05)
// ------------------------------
// import errorHandler from "@/middleware/errorHandlers";
// import { Router } from "express";
// import type { Request, Response, NextFunction } from "express";

// const methodHandler = (handler, status = 200) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const result = await handler(req, res);
//             return res.status(res.statusCode || status).json(result);
//         } catch (error) {
//             errorHandler(error, req, res, next);
//         }
//     };
// };

// const method = {
//     get: (handler) => methodHandler(handler),
//     post: (handler) => methodHandler(handler, 201),
//     put: (handler) => methodHandler(handler),
//     patch: (handler) => methodHandler(handler),
//     delete: (handler) => methodHandler(handler, 204),
//     options: (handler) => methodHandler(handler),
// };

// export const routing = (action) => {
//     const router = Router();

//     const route = {
//         get: (path: string, ...handlers) => {
//             const controller = handlers.pop();
//             router.get(path, handlers, method.get(controller));
//         },
//         post: (path: string, ...handlers) => {
//             const controller = handlers.pop();
//             router.post(path, handlers, method.post(controller));
//         },
//         put: (path: string, ...handlers) => {
//             const controller = handlers.pop();
//             router.put(path, handlers, method.put(controller));
//         },
//         patch: (path: string, ...handlers) => {
//             const controller = handlers.pop();
//             router.patch(path, handlers, method.patch(controller));
//         },
//         delete: (path: string, ...handlers) => {
//             const controller = handlers.pop();
//             router.delete(path, handlers, method.delete(controller));
//         },
//         options: (path: string, ...handlers) => {
//             const controller = handlers.pop();
//             router.options(path, handlers, method.options(controller));
//         },
//     };

//     action(route);
//     return router;
// };
