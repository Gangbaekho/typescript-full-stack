import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

import { Field, Int, ObjectType } from "type-graphql";

// ObjectType 이라는 것은
// 이 Entity를 GraphQL의 type으로 만들기 위한 것이다.
@ObjectType()
// Entity라는 Decorator는
// Database와 Mapping을 하기 위함이다. (MikroORM)
// 그러니까 Decorator가 붙는 목적이 다르다는 것을 알아야 한다.
@Entity()
export class Post {
  // Field는 GraphQL 때문에
  @Field(() => Int)
  // 아래있는것은 MikroORM 떄문에 붙인것임.
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  // type을 따로 써주지 않으면은
  // varchar(255)가 default로 된다.
  @Field(() => String)
  @Property({ type: "text" })
  title!: string;
}
