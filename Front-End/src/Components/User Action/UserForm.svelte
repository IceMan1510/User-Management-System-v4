<script>
  let firstLoad = false;
  import { createEventDispatcher } from "svelte";

  const handleButton = (dataToBeUpdated) => {
    firstLoad = true;

    if (dataToBeUpdated === undefined || dataToBeUpdated === "") {
      handlePost();
    } else {
      handleUpdate();
    }
  };

  let checkPwd = (str) => {
    if (
      str.length < 8 ||
      str.length > 500 ||
      str.search(/\d/) == -1 ||
      str.search(/[a-zA-Z]/) == -1 ||
      str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) != -1
    ) {
      return false;
    } else {
      return true;
    }
  };
  const dispatch = createEventDispatcher();
  let userDetail = "";
  var containsAlpha = (str) => {
    const specialChars = /^[a-zA-Z]+$/;
    return specialChars.test(str);
  };
  var validation = (field) => {
    if (field.trim() === "" || !containsAlpha(field)) {
      return false;
    } else {
      return true;
    }
  };
  var validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  var validateContactNumber = (input) => {
    const regex = /^\d{10}$/; // regex pattern to match exactly 10 digits
    return regex.test(input);
  };
  var isZipNumber = (zip) => {
    if (isNaN(zip)) {
      return false;
    }

    if (zip.toString().length !== 6) {
      return false;
    }

    return true;
  };

  var checkDate = (date) => {
    if (
      new Date(date).getFullYear() < 1970 ||
      new Date(date).getFullYear() > 2005 ||
      userDetail.dob === "Select Date" ||
      userDetail.dob === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  export let dataToBeUpdated;
  if (dataToBeUpdated === undefined) {
    userDetail = {
      f_name: "",
      m_name: "",
      l_name: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword: "",
      date_of_birth: "",
      gender: "",
      address_line1: "",
      address_line2: "",
      landmark: "",
      city_name: "",
      zip_code: "",
      state_name: "Select State",
    };
  } else {
    console.log(dataToBeUpdated);
    const inputDate = dataToBeUpdated.date_of_birth;
    const dateObj = new Date(inputDate);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    dataToBeUpdated.date_of_birth = `${year}-${month}-${day}`;
    userDetail = {
      id: dataToBeUpdated.u_id,
      city_id: dataToBeUpdated.city_id,
      add_id: dataToBeUpdated.add_id,
      state_id: dataToBeUpdated.state_id,
      f_name: dataToBeUpdated.f_name,
      m_name: dataToBeUpdated.m_name,
      l_name: dataToBeUpdated.l_name,
      email: dataToBeUpdated.email,
      contact: dataToBeUpdated.contact,
      password: "",
      confirmPassword: "",
      date_of_birth: dataToBeUpdated.date_of_birth,
      gender: dataToBeUpdated.gender,
      address_line1: dataToBeUpdated.address_line1,
      address_line2: dataToBeUpdated.address_line2,
      landmark: dataToBeUpdated.landmark,
      city_name: dataToBeUpdated.city_name,
      zip_code: dataToBeUpdated.zip_code,
      state_name: dataToBeUpdated.state_name,
      passForVerification: dataToBeUpdated.password,
    };
  }
  const handlePost = () => {
    dispatch("post", userDetail);
  };
  const handleUpdate = () => {
    dispatch("update", userDetail);
  };
</script>

<main>
  <h2 class="text-center pt-2 font-weight-bold">Registration Form</h2>
  <div class="container center-div w-75">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form>
          <div class="form-row">
            <div class="col">
              <label for="validationCustom01"
                >First name<span class="text-danger"> *</span></label
              >
              <input
                type="text"
                name="firstName"
                title="Enter a valid name"
                class={firstLoad && !validation(userDetail.f_name)
                  ? "form-control is-invalid"
                  : "form-control"}
                bind:value={userDetail.f_name}
                autofocus
                placeholder="First Name"
              />
              <div class="invalid-feedback">
                Please enter a valid first name
              </div>
            </div>
            <div class="col">
              <label for="validationCustom02"
                >Middle name<span class="text-danger"> *</span></label
              >
              <input
                type="text"
                name="LastName"
                title="Enter a valid mid name"
                bind:value={userDetail.m_name}
                placeholder="Middle Name"
                class={firstLoad && !validation(userDetail.m_name)
                  ? "form-control is-invalid"
                  : "form-control"}
              />
              <div class="invalid-feedback">Please enter a valid mid name</div>
            </div>
            <div class="col">
              <label for="validationCustom02"
                >Last name<span class="text-danger"> *</span></label
              >
              <input
                type="text"
                name="LastName"
                title="Enter a valid last name"
                bind:value={userDetail.l_name}
                placeholder="Last Name"
                class={firstLoad && !validation(userDetail.l_name)
                  ? "form-control is-invalid"
                  : "form-control"}
              />
              <div class="invalid-feedback">Please enter a valid Last</div>
            </div>
          </div>

          <div class="form-row extra">
            <div class="form-group col-md-6">
              <label for="inputEmail4"
                >Email<span class="text-danger">*</span></label
              >
              <input
                type="text"
                name="email"
                bind:value={userDetail.email}
                title="Enter a unique and valid email id"
                class={firstLoad && !validateEmail(userDetail.email)
                  ? "form-control is-invalid"
                  : "form-control"}
                placeholder="Email Id"
              />
              <div class="invalid-feedback">Please enter a valid email</div>
            </div>
            <div class="form-group col-md-6">
              <label for="inputEmail4"
                >Contact<span class="text-danger">*</span></label
              >
              <input
                type="Contact"
                name="Contact"
                maxlength="10"
                title="Enter a Contact"
                class={firstLoad && !validateContactNumber(userDetail.contact)
                  ? "form-control is-invalid"
                  : "form-control"}
                bind:value={userDetail.contact}
                placeholder="Contact"
              />
              <div class="invalid-feedback">
                Enter a valid 10 digit contact number
              </div>
            </div>
          </div>
          <div class="form-row extraPass">
            <div class="col">
              <label for="inputPassword"
                >{dataToBeUpdated === undefined || dataToBeUpdated === ""
                  ? "Password"
                  : "Old Password"}<span class="text-danger"> *</span></label
              >
              <input
                type="Password"
                name="password"
                title="Password should be greater than 8 digits"
                bind:value={userDetail.password}
                placeholder="Password"
                class={firstLoad && !checkPwd(userDetail.password)
                  ? "form-control is-invalid"
                  : "form-control"}
              />
              <div class="invalid-feedback">
                {dataToBeUpdated === undefined || dataToBeUpdated === ""
                  ? "Password should be greater than 8 digits and at must contain 1 number, 1 special character, 1 upper and 1 lower case letter."
                  : "Old Password Doesn't Match"}
              </div>
            </div>
            <div class="form-group col-md-6">
              <label for="inputEmail4">
                {dataToBeUpdated === undefined || dataToBeUpdated === ""
                  ? "Confirm Password"
                  : "New Password"} <span class="text-danger"> *</span></label
              >
              <input
                type="Password"
                name="password"
                title="Confirm Password should match password "
                class={firstLoad &&
                userDetail.password !== userDetail.confirmPassword
                  ? "form-control is-invalid"
                  : "form-control"}
                bind:value={userDetail.confirmPassword}
                placeholder="Password"
              />
              <div class="invalid-feedback">
                {dataToBeUpdated === undefined || dataToBeUpdated === ""
                  ? "Password and Confirm Password should match"
                  : "Password should be greater than 8 digits and at must contain 1 number, 1 special character, 1 upper and 1 lower case letter."}
              </div>
            </div>
          </div>
          <div class="form-row extra">
            <div class="form-group col-md-6">
              <label for="inputEmail4"
                >Date Of Birth<span class="text-danger"> *</span></label
              >
              <input
                type="date"
                name="dateOfBirth"
                class={firstLoad && !checkDate(userDetail.date_of_birth)
                  ? "form-control is-invalid"
                  : "form-control"}
                bind:value={userDetail.date_of_birth}
                placeholder="Enter Date"
                onfocus="(this.type='date')"
                min="1990-01-01"
                max="2005-12-31"
              />
              <div class="invalid-feedback">Please enter a valid date</div>
            </div>
            <div class="form-group col-md-6">
              <label for="inputPassword4"
                >Gender<span class="text-danger"> *</span></label
              >
              <input
                title="Select Gender"
                type="radio"
                name="Gender"
                value="Male"
                bind:group={userDetail.gender}
              />Male &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <input
                type="radio"
                name="Gender"
                value="Female"
                bind:group={userDetail.gender}
              />
              Female &nbsp; &nbsp; &nbsp; &nbsp;
              <input
                type="radio"
                name="Gender"
                value="Other"
                bind:group={userDetail.gender}
              />
              Other
              <div
                class={firstLoad && userDetail.gender.trim() === ""
                  ? "genderError"
                  : "invisible"}
              >
                Please select a gender
              </div>
            </div>
          </div>
          <div class="form-row extra">
            <div class="col">
              <label for="validationCustom01"
                >Building/Apartment<span class="text-danger"> *</span></label
              >
              <input
                type="text"
                name="firstName"
                title="Enter building/apartment name"
                class={firstLoad && userDetail.address_line1.trim() === ""
                  ? "form-control is-invalid"
                  : "form-control"}
                bind:value={userDetail.address_line1}
                placeholder="Building/Apartment"
              />
              <div class="invalid-feedback">Please enter a valid address</div>
            </div>
            <div class="col-md-4 mb-3">
              <label for="validationCustom02"
                >Street/Locality<span class="text-danger"> *</span></label
              >
              <input
                type="text"
                name="LastName"
                title="Enter Street/Locality"
                bind:value={userDetail.address_line2}
                placeholder="Street/Locality"
                class={firstLoad && userDetail.address_line2.trim() === ""
                  ? "form-control is-invalid"
                  : "form-control"}
              />
              <div class="invalid-feedback">Please enter a valid data</div>
            </div>
            <div class="col-md-4 mb-3">
              <label for="validationCustom02"
                >Landmark<span class="text-danger"> *</span></label
              >

              <input
                type="text"
                name="firstName"
                title="Enter landmark"
                bind:value={userDetail.landmark}
                placeholder="Landmark"
                class={firstLoad && userDetail.landmark.trim() === ""
                  ? "form-control is-invalid"
                  : "form-control"}
              />
              <div class="invalid-feedback">Please enter a valid data</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inputCity"
                >City<span class="text-danger"> *</span></label
              >
              <input
                title="Enter your City"
                type="Location"
                name="Location"
                bind:value={userDetail.city_name}
                placeholder="City"
                class={firstLoad && userDetail.city_name.trim() === ""
                  ? "form-control is-invalid"
                  : "form-control"}
              />
              <div class="invalid-feedback">Please enter a valid city</div>
            </div>
            <div class="form-group col-md-4">
              <label for="inputState"
                >State<span class="text-danger"> *</span></label
              >
              <select
                title="Select State"
                name="state"
                id="state"
                class={firstLoad && userDetail.state_name === "Select State"
                  ? "form-control is-invalid"
                  : "form-control"}
                bind:value={userDetail.state_name}
              >
                <option value="Select State">{userDetail.state_name}</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Andaman and Nicobar Islands"
                  >Andaman and Nicobar Islands</option
                >
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadar and Nagar Haveli"
                  >Dadar and Nagar Haveli</option
                >
                <option value="Daman and Diu">Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
              <div class="invalid-feedback">Please enter a valid State</div>
            </div>
            <div class="form-group col-md-2">
              <label for="inputZip"
                >Pin Code<span class="text-danger"> *</span></label
              >
              <input
                title="Enter Pin Code"
                type="text"
                name="pin"
                class={firstLoad && !isZipNumber(userDetail.zip_code)
                  ? "form-control is-invalid"
                  : "form-control"}
                placeholder="Pin Code"
                maxlength="6"
                bind:value={userDetail.zip_code}
              />
              <div class="invalid-feedback">Please enter a valid pin code</div>
            </div>
          </div>
          <div class="form-group text-center">
            <button
              class="btn btn-primary text-center"
              on:click|preventDefault={() => {
                handleButton(dataToBeUpdated);
              }}>Register</button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</main>

<style>
  .invalid-feedback {
    margin-top: -10px;
  }
  label {
    color: #212529;
  }
  .genderError {
    margin-top: 0;
    font-size: 0.875em;
    margin-left: 15px;
    color: #de3545;
  }
  .extra {
    margin-bottom: -15px;
  }
  .extraPass {
    margin-bottom: -6px;
  }
</style>
