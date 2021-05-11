// type-graphql이 돌아가려면은
// 이게 필요하다네 뭔지는 잘 모르겠찌만.
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";

import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";

const main = async () => {
  // sendEmail("bob@bob.com", "hello there");
  const orm = await MikroORM.init(mikroConfig);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // 이렇게 Express 단에서 cors를 처리하거나
  // 아래 ApolloServer 단에서 해줄 수 있다.
  // 근데 여기서 하는게 맞는 것 같다.
  // 더 광범위하게 처리해주는 것 같음.
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        // 아래 두 개가 session 정보를
        // 얼만큼의 시간동안 redis에 넣어놓을 것인지에 대해서 설정하는 것이다.
        // true만 해놓으면은 default 시간동안 유지될텐데
        // 그게 얼마인지는 찾아보도록 해야 한다.
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf와 관련있다는데, 잘 모르겠다. 나중에 찾아보자.
        secure: __prod__, // cookie only works in https
      },
      // session에 뭔가를 저장할떄만 저장한다는 것임.
      // empty session는 만들지 않겠다는 말임.
      saveUninitialized: false,
      secret: "jalsdjioqhoihdjkansd",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    // cors 처리를 여기서 해주는거구나.
    // 이렇게 해줘도 되고, 아예 cors라는 package를 다운받아서 해도 된다.
    // cors: { origin: "http://localhost:3000" },
    // 여기에서는 false 처리해주고 Express app 에서
    // cors package를 쓰는 방법을 사용했다. 참고하도록 하자.
    cors: false,
  });

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
