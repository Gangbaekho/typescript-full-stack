import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  // 여기서 문제가 발생하는데,
  // Post는 Entity class이지
  // GraphQL의 type은 아니라서 쓸 수 없게 된다는 것이다.
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }
}
