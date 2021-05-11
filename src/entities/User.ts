import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ unique: true })
  username!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true, nullable: true })
  email!: string;

  // password는 graphql의 field로 넣지 않는 것을
  // 주목하길 바람. password를 보여줄 필요가 없기 떄문이다.
  @Property()
  password!: string;
}
