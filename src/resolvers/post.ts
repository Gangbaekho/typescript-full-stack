import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  // 여기서 문제가 발생하는데,
  // Post는 Entity class이지
  // GraphQL의 type은 아니라서 쓸 수 없게 된다는 것이다.
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  // Query 역시나 GraphQL에 관한 것이고
  // !를 쓸 수 없으니까 option을 통해서 nullable을 줬다고 생각하면 된다.
  @Query(() => Post, { nullable: true })
  post(
    // Arg 안에 있는 'id'는 graphql에서 argument로 집어넣을 것이고
    // 그 옆에 있는 id는 id로 받아서 우리가 쓰겠다는 것임.
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): // 여기 밑에 있는 Promise는 Typescript니까 null이라고 쓴거임.
  // 항상 햇갈리지 말 것,
  Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      // persistAndFlust가 그냥 sequelize의 save와 같다고
      // 생각을 하면 될 듯 하다.
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
