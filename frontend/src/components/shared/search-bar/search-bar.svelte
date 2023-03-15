<script>
  import { createEventDispatcher } from "svelte";
  $: searchField = "";

  console.log(searchField);
  const dispatch = createEventDispatcher();
</script>

<input
  type="search"
  placeholder="Email To Search + Enter"
  bind:value={searchField}
  on:keypress={(e) => {
    if (e.key === "Enter") {
      console.log(searchField);
      dispatch("message", {
        block: "searchField",
        data: searchField.trim(),
      });
    }
  }}
/>
