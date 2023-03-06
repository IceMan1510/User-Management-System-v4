<script>
  let loading = true;
  let limit = 2;
  import { createEventDispatcher, onMount } from "svelte";
  import { tooltip } from "@svelte-plugins/tooltips";

  import { Confirm } from "svelte-confirm";
  import Loader from "../Shared/Loader/Loader.svelte";
  const dispatch = createEventDispatcher();
  var formatDate = (dateString) => {
    const date = new Date(dateString); // create a new Date object
    const day = date.getDate().toString().padStart(2, "0"); // get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // get month and pad with leading zero if necessary
    const year = date.getFullYear(); // get year
    return `${day}/${month}/${year}`; // concatenate day, month, and year in the desired format
  };

  export let userData;
  export let fetchData;
  export let totalRecords;
  export let totalPages;
  export let searchData;
  export let totalRecordPerPage;
  export let page;
  /**
   *  Broadcast the delete event once the user clicks on the delete button in the table.
   *  @param {string}-The id of the user clicked.
   */
  const handleDelete = (id) => {
    dispatch("delete", id);
  };
  /**
   *  Broadcast the update event once the user clicks on the edit button in the table.
   *  @param {Object}-The object data of the user clicked.
   */
  const handleUpdate = (data) => {
    dispatch("update", data);
  };
  const handlePage = (page) => {
    dispatch("page", page);
  };
  const handlePrev = () => {
    dispatch("prev", { message: "prev" });
  };
  const handleNext = () => {
    dispatch("next", { message: "next" });
  };
  onMount(() => {
    if (searchData === "") {
      fetchData();
      setTimeout(() => {
        loading = false;
      }, 1000);
    }
    fetchData(searchData);
    setTimeout(() => {
      loading = false;
    }, 1000);
  });
</script>

{#if loading}
  <span><Loader /></span>
{:else if userData.length === 0}
  <h1 class="text-center">Data Not Found</h1>
{:else}
  <body>
    <div class="table-wrapper">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Birthday</th>
            <th>Email</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each userData as uData}
            <tr>
              <td>
                {uData.f_name}
                {uData.m_name}
                {uData.l_name}</td
              >
              <td>{uData.gender}</td>
              <td>{formatDate(uData.date_of_birth)}</td>
              <td>{uData.email}</td>
              <td>{uData.city_name}, {uData.state_name}</td>

              <td>
                <span class="but"
                  ><a
                    class="settings"
                    use:tooltip={{
                      content: "Edit Record",
                      position: "bottom",
                      arrow: false,
                    }}
                    ><i class="material-icons" on:click={handleUpdate(uData)}
                      >&#xE8B8;</i
                    ></a
                  ></span
                >

                <Confirm
                  confirmTitle="Delete"
                  cancelTitle="Cancel"
                  let:confirm={confirmThis}
                  ><span class="but"
                    ><a
                      class="delete"
                      use:tooltip={{
                        content: "Delete Record",
                        position: "bottom",
                        arrow: false,
                      }}
                      on:click={() => confirmThis(handleDelete, uData.u_id)}
                    >
                      <path
                        fill="hsl(200, 40%, 20%)"
                        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                      /><i class="material-icons">&#xE5C9;</i></a
                    ></span
                  >
                  <span slot="title"> Delete this user? </span>
                </Confirm>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="clearfix">
        <div class="hint-text">
          Showing <b>{(page - 1) * limit + 1}</b> to
          <b>{(page - 1) * limit + totalRecordPerPage}</b> entries out of
          <b>{totalRecords}</b>
        </div>
        <ul class="pagination">
          <li class="page-item">
            <a
              href="#"
              class={1 === page ? "invisible" : "page-link"}
              on:click={() => {
                handlePrev();

                loading = true;
                setTimeout(() => {
                  loading = false;
                }, 500);
              }}>Previous</a
            >
          </li>
          {#each Array(totalPages) as tp, i}
            <li class={page === i ? "page-item active" : "page-item"}>
              <a
                href="#"
                on:click={() => {
                  handlePage(i);
                  loading = true;
                  setTimeout(() => {
                    loading = false;
                  }, 500);
                }}
                class="page-link">{i++ + 1}</a
              >
            </li>
          {/each}
          <li class="page-item ">
            <a
              href="#"
              class={totalPages === page ? "invisible" : "page-link"}
              on:click={() => {
                handleNext();
                loading = true;
                setTimeout(() => {
                  loading = false;
                }, 500);
              }}>Next</a
            >
          </li>
        </ul>
      </div>
    </div>
  </body>
{/if}

<style>
  body {
    color: #566787;
    background: #ffffff;
    font-family: "Varela Round", sans-serif;
    font-size: 13px;
    padding: 0%;
  }
  .table-wrapper {
    min-width: 1000px;
    background: #fff;
    padding: 8px 25px;
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }

  table.table tr th,
  table.table tr td {
    border-color: #e9e9e9;
    padding: 12px 15px;
    vertical-align: middle;
  }
  table.table tr th:first-child {
    width: 200px;
  }
  table.table tr th:last-child {
    width: 100px;
  }
  table.table-striped tbody tr:nth-of-type(odd) {
    background-color: #fcfcfc;
  }
  table.table-striped.table-hover tbody tr:hover {
    background: #f5f5f5;
  }
  table.table th i {
    font-size: 13px;
    margin: 0 5px;
    cursor: pointer;
  }
  table.table td:last-child i {
    opacity: 0.9;
    font-size: 22px;
    margin: 0 5px;
  }
  table.table td a {
    font-weight: bold;
    color: #566787;
    display: inline-block;
    text-decoration: none;
  }
  table.table td a:hover {
    color: #2196f3;
  }
  table.table td a.settings {
    color: #2196f3;
  }
  table.table td a.delete {
    color: #f44336;
  }
  table.table td i {
    font-size: 19px;
  }
  table.table {
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 10px;
  }

  .pagination {
    float: right;
    margin: 0 0 5px;
  }
  .pagination li a {
    border: none;
    font-size: 13px;
    min-width: 30px;
    min-height: 30px;
    color: #212529;
    margin: 0 2px;
    line-height: 30px;
    border-radius: 2px !important;
    text-align: center;
    padding: 0 6px;
  }
  .pagination li a:hover {
    color: #666;
  }
  .pagination li.active a,
  .pagination li.active a.page-link {
    background: #03a9f4;
  }
  .pagination li.active a:hover {
    background: #0397d6;
  }

  .hint-text {
    float: left;
    margin-top: 10px;
    font-size: 13px;
  }
  .but {
    cursor: pointer;
  }
</style>
