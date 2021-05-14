import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

// resolver를 실행하기 전에 이게 먼저 실행되는 것이라고
// 생각하면 됨.
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }

  return next();
};
