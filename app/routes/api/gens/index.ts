import {Configuration, OpenAIApi} from 'openai';
import {db} from "~/utils/db.server";

import {ActionFunction, json, LoaderFunction} from "@remix-run/node";
import {cors} from "remix-utils";

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export const action: ActionFunction = async ({request}) => {
  if (request.method === "POST") {
    const data = JSON.parse(await request.text());

    if (!data.prompt) {
      return json({error: "Missing prompt"}, {status: 400});
    }

    const style = await db.style.findFirst({
      where: {
        id: data.styleId as number
      }
    });

    if (!style) {
      return json({error: "Invalid style"}, {status: 400});
    }

    const promptWithStyle = style.prompt.replace(/{input}/, data.prompt);

    const response = await openai.createImage({
      prompt: promptWithStyle,
      n: 1,
      size: "512x512",
    });
    const imageUrl = response.data.data[0].url!;

    await db.gen.create({
      data: {
        text: data.prompt,
        prompt: promptWithStyle,
        thumbnail: imageUrl,
        styleId: data.styleId
      }
    })

    const postResponse = new Response(imageUrl || '');
    await cors(request, postResponse, {origin: true});
    return postResponse;
  }
}

export const loader: LoaderFunction = async ({request}) => {
  let response = json<string>('ok');
  await cors(request, response, {origin: true});
  return response;
}