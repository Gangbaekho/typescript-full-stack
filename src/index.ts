import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  // 이건 그냥 Object만 만드는 것임.
  // 실제 Database에 insert 되는 것은 아니다.
  const post = orm.em.create(Post, { title: "my first post" });
  // 여기까지 해줘야 insert 되는 것임.
  await orm.em.persistAndFlush(post);
};

main().catch((error) => {
  console.error(error);
});
