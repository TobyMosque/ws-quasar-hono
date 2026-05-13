import { defineBoot } from "#q-app";
import { createApi } from "src/composables/api";

export default defineBoot(({ store }) => {
  createApi(store);
});
