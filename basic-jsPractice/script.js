function calculateResult() {

    let name = document.getElementById("name").value;

    let maths = parseFloat(document.getElementById("maths").value);

    let science = parseFloat(document.getElementById("science").value);

    let english = parseFloat(document.getElementById("english").value);

    // Check if all fields are filled
    if (name == "" || isNaN(maths) || isNaN(science) || isNaN(english)) {
        alert("Please enter all details.");
        return;
    }

    let total = maths + science + english;

    let percentage = total / 3;

    document.getElementById("studentName").innerHTML = name;

    document.getElementById("totalMarks").innerHTML = total + " / 300";

    document.getElementById("percentage").innerHTML = percentage.toFixed(2) + "%";
}