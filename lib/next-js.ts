import path from "path";
import getConfig from "next/config";

export const serverPath = (staticFilePath: string) => {
  let projectRoot =
    getConfig().serverRuntimeConfig.PROJECT_ROOT ?? process.cwd();
  console.log({ projectRoot });
  return path.join(projectRoot, staticFilePath);
};
