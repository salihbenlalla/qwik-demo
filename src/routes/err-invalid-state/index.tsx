import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  routeAction$,
  zod$,
  z,
  Form,
  type RequestEventLoader,
  type RequestEventAction,
} from "@builder.io/qwik-city";
import { type PlatformCloudflarePages } from "@builder.io/qwik-city/middleware/cloudflare-pages";
import type { D1Database, D1Result } from "@miniflare/d1";
import styles from "./todolist.module.css";

declare module "@builder.io/qwik-city/middleware/cloudflare-pages" {
  interface PlatformCloudflarePages {
    DB: D1Database;
  }
}

interface ListItem {
  id: number;
  text: string;
}

export const useListLoader = routeLoader$(
  async (ev: RequestEventLoader<PlatformCloudflarePages>) => {
    if (ev.platform.DB) {
      const { results } = (await ev.platform.DB.prepare(
        "SELECT * FROM Todos"
      ).all()) as D1Result<ListItem>;

      const list = results ?? [];

      return list.map((item) => {
        return { id: item.id, text: item.text };
      });
    }
    return [];
  }
);

export const useAddToListAction = routeAction$(
  async (item, ev: RequestEventAction<PlatformCloudflarePages>) => {
    if (ev.platform.DB) {
      const { success } = await ev.platform.DB.prepare(
        "INSERT INTO Todos (text) VALUES (?)"
      )
        .bind(item.text)
        .all();

      return {
        success,
      };
    }
    return {
      success: false,
    };
  },
  zod$({
    text: z.string(),
  })
);

export default component$(() => {
  const list = useListLoader();
  const action = useAddToListAction();

  return (
    <>
      <div class="section">
        <div class="container center">
          <h1 class="hero">TODO List</h1>
        </div>
      </div>

      <div class="section bright">
        <div class="container center mh-300">
          {(list.value?.length && (
            <ul class={styles.list}>
              {list.value.map((item, index) => (
                <li key={`items-${index}`}>{item.text}</li>
              ))}
            </ul>
          )) || <span class="no-content">No items found</span>}
        </div>
      </div>

      <div class="section">
        <div class="container center">
          <Form action={action} spaReset>
            <input type="text" name="text" required />{" "}
            <button type="submit">Add item</button>
          </Form>

          <p class={styles.hint}>
            PS: This little app works even when JavaScript is disabled.
          </p>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Qwik Todo List",
};
