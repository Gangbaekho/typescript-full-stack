// type-graphql이 돌아가려면은
// 이게 필요하다네 뭔지는 잘 모르겠찌만.
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.send("hello");
  });
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

  // 아래의 명령어를 쳐주면은, npx mikro-orm migration:create
  // 이걸 안해도 자동으로 migration을 해준다고 생각하면 된다.
  // sequelize의 sync와 비슷한것 같다.
  await orm.getMigrator().up();

  // 이건 그냥 Object만 만드는 것임.
  // 실제 Database에 insert 되는 것은 아니다.
  // const post = orm.em.create(Post, { title: "my first post" });
  // 여기까지 해줘야 insert 되는 것임.
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((error) => {
  console.error(error);
});
