document.addEventListener("DOMContentLoaded", function () {
  let format = localStorage.getItem("format") || "DD-MMM-YYYY hh:mm:ss A"; // 12h
  const utcEl = document.getElementById("utc");
  const vietnamEl = document.getElementById("vietnam");
  const irelandEl = document.getElementById("ireland");
  const indiaEl = document.getElementById("india");
  const irelandTimeInput = document.getElementById("ireland-time");
  const convertTimeVN = document.getElementById("convertTimeVN");
  const convertTimeID = document.getElementById("convertTimeID");
  const countrySelect = document.getElementById("country-select");
  const listGroup = document.querySelector(".list-group");
  let timeString = "00:00";
  let selectedCountries = JSON.parse(
    localStorage.getItem("selectedCountries")
  ) || ["UTC"];

  // config
  const twentyFourFormat = document.getElementById("btnRadio24h");
  const twelveFormat = document.getElementById("btnRadio12h");

  // Set initial country selections
  selectedCountries.forEach((country) => {
    const option = Array.from(countrySelect.options).find(
      (opt) => opt.value === country
    );
    if (option) option.selected = true;
  });

  function createCountryListItem(timezone) {
    const countryName = timezone.split("/").pop().replace("_", " ");
    const listItem = document.createElement("li");
    listItem.className = "list-group-item can-remove d-flex";
    listItem.dataset.country = timezone;
    listItem.innerHTML = `
            <div class="me-3 country d-flex">
                <strong>${countryName}</strong>
            </div>
            <div class="accordion-body d-flex align-items-center w-100" id="${timezone
              .split("/")
              .pop()
              .toLowerCase()}">
                <div class="text-secondary d-flex justify-content-center align-items-center w-100" type="button" disabled>
                    <span role="status">Loading...</span>
                </div>
            </div>
        `;
    return listItem;
  }

  function updateSelectedCountriesDisplay() {
    // Remove any previously added custom country items
    const customItems = listGroup.querySelectorAll(".custom-country-item");
    customItems.forEach((item) => item.remove());

    // Add selected countries that are not default ones
    const defaultCountries = ["utc", "vietnam", "ireland", "india"];

    selectedCountries.forEach((country) => {
      const countryId = country.split("/").pop().toLowerCase();
      if (!defaultCountries.includes(countryId)) {
        const listItem = createCountryListItem(country);
        listItem.classList.add("custom-country-item");
        listGroup.appendChild(listItem);
      }
    });
  }

  function removeCountry(country) {
    selectedCountries = selectedCountries.filter((c) => c !== country);
    localStorage.setItem(
      "selectedCountries",
      JSON.stringify(selectedCountries)
    );

    // Update select options
    const option = Array.from(countrySelect.options).find(
      (opt) => opt.value === country
    );
    if (option) option.selected = false;

    // Remove from display
    const countryId = country.split("/").pop().toLowerCase();
    const listItem = document
      .querySelector(`.custom-country-item #${countryId}`)
      ?.closest("li");
    if (listItem) listItem.remove();

    updateTimeDisplay();
  }

  // Add click event listeners for list items
  document.addEventListener("click", (e) => {
    const listItem = e.target.closest(".list-group-item");
    if (listItem) {
      const country = listItem.dataset.country;
      if (country) {
        removeCountry(country);
      }
    }
  });

  countrySelect.addEventListener("change", (e) => {
    selectedCountries = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    localStorage.setItem(
      "selectedCountries",
      JSON.stringify(selectedCountries)
    );
    updateSelectedCountriesDisplay();
    updateTimeDisplay();
  });

  // Initial display of selected countries
  updateSelectedCountriesDisplay();

  twelveFormat.addEventListener("click", () => {
    format = "DD-MMM-YYYY hh:mm:ss A"; // 12h
    localStorage.setItem("format", format);
    generateTimeCovert("Asia/Ho_Chi_Minh", convertTimeVN);
    generateTimeCovert("Asia/Kolkata", convertTimeID);
    updateTimeDisplay();
  });

  twentyFourFormat.addEventListener("click", () => {
    format = "DD-MMM-YYYY HH:mm:ss"; // 24h
    localStorage.setItem("format", format);
    generateTimeCovert("Asia/Ho_Chi_Minh", convertTimeVN);
    generateTimeCovert("Asia/Kolkata", convertTimeID);
    updateTimeDisplay();
  });

  irelandTimeInput.addEventListener("change", (input) => {
    timeString = input.target.value;
    generateTimeCovert("Asia/Ho_Chi_Minh", convertTimeVN);
    generateTimeCovert("Asia/Kolkata", convertTimeID);
  });

  setRadioButtonFormat();

  function updateTimeDisplay() {
    const [uctDate, utcTime, utcPeriods] = moment
      .utc()
      .format(format)
      .split(" ");
    const [vietnamDate, vietnamTime, vietnamPeriods] = moment
      .tz("Asia/Ho_Chi_Minh")
      .format(format)
      .split(" ");
    const [irelandDate, irelandTime, irelandPeriods] = moment
      .tz("Europe/Dublin")
      .format(format)
      .split(" ");
    const [indiaDate, indiaTime, indiaPeriods] = moment
      .tz("Asia/Kolkata")
      .format(format)
      .split(" ");

    utcEl.innerHTML = generateDateFormat(uctDate, utcTime, utcPeriods);
    vietnamEl.innerHTML = generateDateFormat(
      vietnamDate,
      vietnamTime,
      vietnamPeriods,
      true
    );
    irelandEl.innerHTML = generateDateFormat(
      irelandDate,
      irelandTime,
      irelandPeriods
    );
    indiaEl.innerHTML = generateDateFormat(indiaDate, indiaTime, indiaPeriods);

    // Update selected countries time display
    selectedCountries.forEach((country) => {
      const [selectedDate, selectedTime, selectedPeriods] = moment
        .tz(country)
        .format(format)
        .split(" ");
      const selectedCountryEl = document.getElementById(
        country.split("/").pop().toLowerCase()
      );
      if (selectedCountryEl) {
        selectedCountryEl.innerHTML = generateDateFormat(
          selectedDate,
          selectedTime,
          selectedPeriods,
          true
        );
      }
    });
  }

  setInterval(updateTimeDisplay, 1000);

  function generateDateFormat(uctDate, utcTime, utcPeriods, isVietnam = false) {
    return `<div class="d-flex justify-content-center align-items-center w-100">
                    <img
                        src="./images/date.svg"
                        alt
                        srcset
                        class="date me-2 mb-1"
                    >
                    <strong class="text-${
                      isVietnam ? "danger" : "primary"
                    } utc-date">${uctDate}</strong>
                    <span class="badge text-bg-warning ms-3 d-flex align-items-center utc-time badge-custom">
                        ${utcTime}
                        ${
                          utcPeriods
                            ? `<span class="badge text-bg-${
                                utcPeriods === "PM" ? "danger" : "success"
                              } ms-2">${utcPeriods}</span>`
                            : ``
                        }
                    </span>
                </div>`;
  }

  function generateTimeCovert(target, id) {
    const [irelandDate, irelandTime, irePeriods] = moment
      .tz("Europe/Dublin")
      .format(format)
      .split(" ");
    const irelandCurrentTime = moment.tz(
      `${irelandDate} ${timeString}:00`,
      format,
      "Europe/Dublin"
    );
    const [targetDate, targetTime, utcPeriods] = irelandCurrentTime
      .tz(target)
      .format(format)
      .split(" ");
    id.innerHTML = `
        <span 
            class="badge badge-custom d-flex justify-content-center align-items-center text-bg-light text-success convert-time"
        >
        ${targetTime} ${
      utcPeriods
        ? `<span class="badge text-bg-${
            utcPeriods === "PM" ? "danger" : "success"
          } ms-2">${utcPeriods}</span>`
        : ``
    }
        <img
                src="./images/clock.svg"
                alt
                srcset
                class="clock-convert ms-2"
            >
       </span>`;
  }

  function setRadioButtonFormat() {
    if (format === "DD-MMM-YYYY HH:mm:ss") {
      twentyFourFormat.checked = true;
    } else {
      twelveFormat.checked = true;
    }
  }
});
