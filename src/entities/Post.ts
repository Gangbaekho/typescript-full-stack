import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

// ObjectType 이라는 것은
// 이 Entity를 GraphQL의 type으로 만들기 위한 것이다.
@ObjectType()
// Entity라는 Decorator는
// Database와 Mapping을 하기 위함이다. (MikroORM)
// 그러니까 Decorator가 붙는 목적이 다르다는 것을 알아야 한다.
@Entity()
// BaseEntity를 해줘야 static method를 쓸 수 있다는 것 같다.
export class Post extends BaseEntity {
  // Field는 GraphQL 때문에
  @Field(() => Int)
  // 아래있는것은 MikroORM 떄문에 붙인것임.
  @PrimaryGeneratedColumn()
  id!: number;

  // type을 따로 써주지 않으면은
  // varchar(255)가 default로 된다.
  @Field(() => String)
  @Column()
  title!: string;

  @Field(() => String)
  @Column()
  text!: string;

  @Field(() => String)
  @Column({ type: "int", default: 0 })
  points!: number;

  // 이걸 foreign key로 쓰려는 것 같다.
  @Field()
  @Column()
  creatorId: number;

  // user.posts 는 user에서 posts로 Post를 접근하게 할 수 있다는 것 같다.
  // 그걸 왜 여기서 하는지는 잘 모르겠찌만.
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();
}
