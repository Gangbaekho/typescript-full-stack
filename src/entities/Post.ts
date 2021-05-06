import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  // type을 따로 써주지 않으면은
  // varchar(255)가 default로 된다.
  @Property({ type: "text" })
  title!: string;
}
