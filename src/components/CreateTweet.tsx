import { object, string } from "zod";

import { api } from "../utils/api";
import { useState } from "react";
import { util } from "prettier";

export const tweetSchema = object({
  text: string({
    required_error: "Tweet text is required",
  })
    .min(10)
    .max(280),
});

export function CreateTweet() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const utils = api.useContext();
  const { mutateAsync } = api.tweet.create.useMutation({
    onSuccess: async () => {
      setText("");
      await utils.tweet.timeline.invalidate();
    },
  });

  // @ts-ignore
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ text }, 1);
    try {
      console.log({ text });
      tweetSchema.parse({ text });
    } catch (e) {
      setError(e.message);
      return;
    }

    mutateAsync({ text });
  };

  return (
    <>
      {error && JSON.stringify(error)}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col rounded-md border-2 p-4"
      >
        <textarea
          className="w-full p-4 shadow"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md bg-primary py-2 px-4 text-white"
            type="submit"
          >
            Tweet
          </button>
        </div>
      </form>
    </>
  );
}
