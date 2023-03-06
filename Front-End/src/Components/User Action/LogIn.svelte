<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  var email = "";
  var password = "";
  const handleSubmit = (email, password) => {
    dispatch("message", { email: email, password: password });
  };
</script>

<div
  class="container1"
  style="width: 30%; margin-top: 5%; margin-left: 33.33%;"
>
  <form>
    <h2 class="text-center">Log In</h2>
    <!-- Email input -->
    <div class="form-outline">
      <label class="form-label">Email address</label>
      <input
        type="email"
        placeholder="Email Id"
        title="Enter a unique and valid email id"
        class="form-control"
        bind:value={email}
        required
      />
    </div>

    <!-- Password input -->
    <div class="form-outline">
      <label class="form-label">Password</label>
      <input
        type="password"
        title="Enter a valid password"
        placeholder="Password"
        class="form-control"
        bind:value={password}
        required
      />
    </div>

    <!-- Submit button -->
    <button
      type="button"
      class="btn btn-primary btn-block mb-4"
      on:click|preventDefault={handleSubmit(email, password)}>Sign in</button
    >
  </form>
</div>

<style>
  /* .table-title {
    background: #299be4;
    color: #fff;
    padding: 16px 30px;
    margin: 0px 0px 0px;
    border-radius: 3px 3px 0 0;
  }
  .table-title h2 {
    margin: 2px 0 0;
    font-size: 24px;
  } */
</style>
