function getFormValues() {
    // applicantName
    const nameInput = document.getElementById("applicantNameInput").value || " ";
    const name1 = document.getElementById("applicantName1");
    const name2 = document.getElementById("applicantName2");
    name1.innerHTML = nameInput;
    name2.innerHTML = nameInput;

    // leaveType
    const leaveTypeInput = document.querySelector('input[name="leaveTypeInput"]:checked');
    let leaveTypeVar = leaveTypeInput ? leaveTypeInput.value : " ";
    if (leaveTypeVar == "其他") {
        leaveTypeVar = "其他：" + document.getElementById("otherInput").value || "未填寫";
    }
    const leaveType = document.getElementById("leaveType");
    leaveType.innerHTML = leaveTypeVar;

    // todayDate
    var today = new Date();
    const todayDate = document.getElementById("todayDate");
    var currentMonth = today.getMonth() + 1;
    var currentDay = today.getDate();
    if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
    if (currentDay < 10) { currentDay = '0' + currentDay; }
    todayDate.innerHTML = today.getFullYear() + "/" + currentMonth + "/" + currentDay;

    // leaveDate
    const leaveDateInput = document.getElementById("leaveDateInput").value || " ";
    const leaveDate = document.getElementById("leaveDate");
    leaveDate.innerHTML = leaveDateInput.replaceAll("-", "/");

    //leaveHours
    const leaveHoursInput = document.getElementById("leaveHoursInput").value || " ";
    let leaveHours = document.getElementById("leaveHours").innerHTML;
    if (leaveHoursInput != " " && leaveHoursInput > 0) {
        leaveHours = leaveHoursInput;
    }

    // range
    const rangeStart = document.getElementById("rangeStartInput").value || " ";
    const rangeEnd = document.getElementById("rangeEndInput").value || " ";
    const rangeInput = rangeStart + "-" + rangeEnd;
    const range = document.getElementById("range");
    range.innerHTML = rangeInput + "<br>共" + leaveHours + "小時";

    // proxy
    const proxyInput = document.getElementById("proxyInput").value || " ";
    const proxy = document.getElementById("proxy");
    proxy.innerHTML = proxyInput;

    // reason
    const reasonInput = document.getElementById("reasonInput").value || " ";
    const reason = document.getElementById("reason");
    reason.innerHTML = reasonInput;

    // note
    const noteInput = document.getElementById("noteInput").value || " ";
    const note = document.getElementById("note");
    note.innerHTML = noteInput;

    // pdf
    const pdf = new jsPDF();
    const printHtml = document.querySelector("#container");

    html2canvas(printHtml, { scale: 3 }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 170);
        pdf.save(nameInput + "_請假申請表_" + leaveDateInput + ".pdf");
    });
}

function calculateLeaveHours() {
    const rangeStart = document.getElementById("rangeStartInput").value;
    const rangeEnd = document.getElementById("rangeEndInput").value;
    const leaveHours = document.getElementById("leaveHours");

    const startTime = new Date("1970-01-01 " + rangeStart);
    const endTime = new Date("1970-01-01 " + rangeEnd);
    if (endTime <= startTime) {
        leaveHours.innerHTML = "0";
        return;
    }

    const RestStart = new Date("1970-01-01T12:30:00");
    const RestEnd = new Date("1970-01-01T13:30:00");
    if (startTime >= RestStart && endTime <= RestEnd) {
        leaveHours.innerHTML = "0";
        return;
    }

    let result = (endTime - startTime) / 1000 / 60 / 60;
    if (startTime < RestStart && endTime > RestEnd) {
        leaveHours.innerHTML = (result - 1).toFixed(2);
        return;
    }

    // if ((startTime < RestStart && endTime <= RestStart) || (startTime >= RestEnd && endTime > RestEnd)) {
    //   leaveHours.innerHTML = result.toFixed(2);
    //   return;
    // }
    // if (startTime < RestStart && (endTime > RestStart && endTime <= RestEnd)) {
    //   const offset = (endTime - RestStart) / 1000 / 60 / 60;
    //   leaveHours.innerHTML = (result - offset).toFixed(2);
    //   return;
    // }
    // if (endTime > RestEnd && (startTime >= RestStart && startTime < RestEnd)) {
    //   const offset = (RestEnd - startTime) / 1000 / 60 / 60;
    //   leaveHours.innerHTML = (result - offset).toFixed(2);
    //   return;
    // }

    let offset = Math.min(endTime - RestStart, RestEnd - startTime) / 1000 / 60 / 60;
    if (offset < 0) { offset = 0 };
    leaveHours.innerHTML = (result - offset).toFixed(2);
}