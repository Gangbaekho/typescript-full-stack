import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  // 여기서 문제가 발생하는데,
  // Post는 Entity class이지
  // GraphQL의 type은 아니라서 쓸 수 없게 된다는 것이다.
  @Query(() => [Post])
  async posts(
    @Arg("limit") limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    // Typeorm은 그냥 바로 가져와서 사용하는구나.
    // return await Post.find();

    // 이건 query Builder를 이용하는 방법인데
    // raw한 query를 쓸 때 쓰는것으로 생각이 된다.
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Post)
      // "p는 alias를 말하는 것 같다."
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }

    return qb.getMany();
  }

  // Query 역시나 GraphQL에 관한 것이고
  // !를 쓸 수 없으니까 option을 통해서 nullable을 줬다고 생각하면 된다.
  @Query(() => Post, { nullable: true })
  post(
    // Arg 안에 있는 'id'는 graphql에서 argument로 집어넣을 것이고
    // 그 옆에 있는 id는 id로 받아서 우리가 쓰겠다는 것임.
    @Arg("id", () => Int) id: number
  ): // 여기 밑에 있는 Promise는 Typescript니까 null이라고 쓴거임.
  // 항상 햇갈리지 말 것,
  Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    // 근데 문제가 되는건 이게 2 sql queries라는 것이다.
    // insert -> select

    // 이걸로 session을 체크해서
    // authenticated 되지 않았으면은 error를 throw하면 되는데
    // 문제는 매번이 코드를 써야한다는 거임. 중복된다.
    // type-graphql에서 이 문제를 middleware로 해결해준다네
    // @UseMiddleware로 이 문제를 해결하고 있음.
    // 그래서 지운다.
    // if (!req.session.userId) {
    //   throw new Error("not authenticated");
    // }

    return await Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
    // const post = em.create(Post, { title });
    // await em.persistAndFlush(post);
    // return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      // persistAndFlust가 그냥 sequelize의 save와 같다고
      // 생각을 하면 될 듯 하다.
      // await em.persistAndFlush(post);
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
