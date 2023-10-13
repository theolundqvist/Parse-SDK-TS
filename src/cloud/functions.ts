import { Primitive } from "../db";
import { DbError } from "../misc";

export async function joinCourse(courseId: string) : Promise<void> {
  return Primitive.Cloud.run("joinCourse", {
    courseId: courseId 
  }).catch(DbError.parse)
}

export async function leaveCourse(courseId: string) : Promise<void> {
  return Primitive.Cloud.run("leaveCourse", {
    courseId: courseId 
  }).catch(DbError.parse)
}

type CloudFunctionParam = {
  name: string,
  value: any
}

type CloudFunction<T> = {
  name: string,
  params: CloudFunctionParam[],
  return: T
}

export async function call<T>(func: CloudFunction<T>) : Promise<T> {
  const params = func.params.reduce((acc, param) => {
    acc[param.name] = param.value
    return acc
  }, {} as any)
  return Primitive.Cloud.run(func.name, params).catch(DbError.parse)
}
