document.addEventListener('DOMContentLoaded', function () {
    let format = localStorage.getItem('format') || 'DD-MMM-YYYY hh:mm:ss A'; // 12h
    const utcEl = document.getElementById('utc');
    const vietnamEl = document.getElementById('vietnam');
    const irelandEl = document.getElementById('ireland');
    const indiaEl = document.getElementById('india');

    // config
    const twentyFourFormat = document.getElementById('btnRadio24h');
    const twelveFormat = document.getElementById('btnRadio12h');

    twelveFormat.addEventListener('click', () => {
        format = 'DD-MMM-YYYY hh:mm:ss A'; // 12h
        localStorage.setItem('format', format)
    })

    twentyFourFormat.addEventListener('click', () => {
        format = 'DD-MMM-YYYY HH:mm:ss'; // 24h
        localStorage.setItem('format', format)
    })

    setRadioButtonFormat();

    setInterval(() => {
        const [uctDate, utcTime, utcPeriods] = moment.utc().format(format).split(" ");
        const [vietnamDate, vietnamTime, vietnamPeriods] = moment.tz('Asia/Ho_Chi_Minh').format(format).split(" ");
        const [irelandDate, irelandTime, irelandPeriods] = moment.tz('Europe/Dublin').format(format).split(" ");
        const [indiaDate, indiaTime, indiaPeriods] = moment.tz('Asia/Kolkata').format(format).split(" ");

        utcEl.innerHTML = generateDateFormat(uctDate, utcTime, utcPeriods);
        vietnamEl.innerHTML = generateDateFormat(vietnamDate, vietnamTime, vietnamPeriods, true);
        irelandEl.innerHTML = generateDateFormat(irelandDate, irelandTime, irelandPeriods);
        indiaEl.innerHTML = generateDateFormat(indiaDate, indiaTime, indiaPeriods);
    }, 1000);

    function generateDateFormat(uctDate, utcTime, utcPeriods, isVietnam = false) {
        return `<div class="d-flex justify-content-center align-items-center w-100">
                    <img
                        src="./images/date.svg"
                        alt
                        srcset
                        class="date me-2 mb-1"
                    >
                    <strong class="text-${isVietnam ? 'danger' : 'primary'} utc-date">${uctDate}</strong>
                    <span class="badge text-bg-warning ms-3 d-flex align-items-center utc-time badge-custom">
                        ${utcTime}
                        ${utcPeriods ? `<span class="badge text-bg-${utcPeriods === 'PM' ? 'danger' : 'success'} ms-2">${utcPeriods}</span>` : ``}
                    </span>
                </div>`;
    }

    function setRadioButtonFormat() {
        if (format === 'DD-MMM-YYYY HH:mm:ss') {
            twentyFourFormat.checked = true;
        } else {
            twelveFormat.checked = true;
        }
    }


});