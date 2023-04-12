import { IsString, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  @Length(10, 30)
  title: string;
}
