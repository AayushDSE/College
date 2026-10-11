
let names = [];
let mathsMarks = [];
let scienceMarks = [];
let englishMarks = [];

function addStudent() {
    let name = document.getElementById("name").value.trim();

    let mathsInput = document.getElementById("maths").value;
    let scienceInput = document.getElementById("science").value;
    let englishInput = document.getElementById("english").value;

    let maths = Number(mathsInput);
    let science = Number(scienceInput);
    let english = Number(englishInput);

    if (name == "" || mathsInput == "" || scienceInput == "" || englishInput == "" ||
        maths < 0 || maths > 100 || science < 0 || science > 100 ||
        english < 0 || english > 100) {
        alert("Enter a valid name and marks between 0 and 100 for all subjects.");
        return;
    }

    names.push(name);
    mathsMarks.push(maths);
    scienceMarks.push(science);
    englishMarks.push(english);

    displayStudents();

    document.getElementById("name").value = "";
    document.getElementById("maths").value = "";
    document.getElementById("science").value = "";
    document.getElementById("english").value = "";
    document.getElementById("name").focus();
}

function getTotal(i) {
    return mathsMarks[i] + scienceMarks[i] + englishMarks[i];
}

function getPercentage(i) {
    return (getTotal(i) / 300 * 100).toFixed(2);
}

function findTopper() {
    let topper = 0;

    for (let i = 1; i < names.length; i++) {
        if (getTotal(i) > getTotal(topper)) {
            topper = i;
        }
    }

    return topper;
}

function displayStudents() {
    let table = document.getElementById("studentTableBody");
    let banner = document.getElementById("topperBanner");
    let topperText = document.getElementById("topperText");

    if (names.length == 0) {
        table.innerHTML = "<tr><td colspan='8' class='empty-note'>No students added yet — fill the form above and click \"Add to Register\".</td></tr>";
        banner.style.display = "none";
        return;
    }

    let topper = findTopper();
    let rows = "";

    for (let i = 0; i < names.length; i++) {
        rows += "<tr" + (i == topper ? " class='topper-row'" : "") + ">";
        rows += "<td>" + (i + 1) + "</td><td>" + names[i];

        if (i == topper) {
            rows += " <span class='stamp'>Topper</span>";
        }

        rows += "</td>";
        rows += "<td>" + mathsMarks[i] + "</td>";
        rows += "<td>" + scienceMarks[i] + "</td>";
        rows += "<td>" + englishMarks[i] + "</td>";
        rows += "<td>" + getTotal(i) + "</td>";
        rows += "<td>" + getPercentage(i) + "%</td>";
        rows += "<td><button class='ghost' onclick='deleteStudent(" + i + ")'>Remove</button></td>";
        rows += "</tr>";
    }

    table.innerHTML = rows;

    banner.style.display = "flex";
    topperText.innerHTML = names[topper] + " leads the class with " +
        getTotal(topper) + " / 300 (" + getPercentage(topper) + "%)";
}

function deleteStudent(i) {
    names.splice(i, 1);
    mathsMarks.splice(i, 1);
    scienceMarks.splice(i, 1);
    englishMarks.splice(i, 1);

    displayStudents();
}
