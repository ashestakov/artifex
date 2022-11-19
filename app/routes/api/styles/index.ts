import {json, LoaderFunction} from "@remix-run/node";
import {db} from "~/utils/db.server";
import {style} from "@prisma/client";
import {cors} from "remix-utils";

type LoaderData = { styles: Array<style> };

export const loader: LoaderFunction = async ({request}) => {
  const data: LoaderData = {
    styles: await db.style.findMany(),
  };

  let response = json<LoaderData>(data);
  await cors(request, response, {origin: true});
  return response;
};