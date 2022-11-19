import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import type {style} from "@prisma/client";

import {db} from "~/utils/db.server";

type LoaderData = { styles: Array<style> };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    styles: await db.style.findMany(),
  };
  return json(data);
};

export default function Index() {
  const styles = useLoaderData<LoaderData>().styles;

  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.4"}}>
      <h1>Welcome to Remix</h1>
      <ul>
        {
          styles.map((style) => (

            <li key={style.id}>
              {style.name}
              <img src={style.thumbnail} alt={style.name} />
            </li>
          ))
        }
      </ul>
    </div>
  );
}
