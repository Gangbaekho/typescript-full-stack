import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  // 아래의 명령어를 쳐주면은, npx mikro-orm migration:create
  // 이걸 안해도 자동으로 migration을 해준다고 생각하면 된다.
  // sequelize의 sync와 비슷한것 같다.
  // await orm.getMigrator().up();

  // 이건 그냥 Object만 만드는 것임.
  // 실제 Database에 insert 되는 것은 아니다.
  // const post = orm.em.create(Post, { title: "my first post" });
  // 여기까지 해줘야 insert 되는 것임.
  // await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

main().catch((error) => {
  console.error(error);
});
