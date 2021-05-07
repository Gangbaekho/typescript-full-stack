import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
  migrations: {
    // 아래의 경로에다가 migrations 정보를 넣겠다는 것 같음.
    // npx mikro-orm migration:create
    // 이 명령어를 쳐주면은 migration이 진행된다.
    // DDL 관련한 것을 해주는 것으로 생각이 된다.
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "reddit",
  user: "jinsoo",
  password: "jinsoo",
  debug: !__prod__,
  type: "mysql",
} as Parameters<typeof MikroORM.init>[0];
