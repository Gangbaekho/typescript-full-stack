import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  // hello라는 query의 parameter와 return type을 설정하는 듯 하다.
  @Query(() => String)
  hello() {
    return "hello world";
  }
}
