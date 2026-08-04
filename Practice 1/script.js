function addStudent() {
  var name = document.getElementById("name").value;
  var m1 = Number(document.getElementById("m1").value);
  var m2 = Number(document.getElementById("m2").value);
  var m3 = Number(document.getElementById("m3").value);

  var total = m1 + m2 + m3;
  var percentage = (total / 300) * 100;

  var row = "<tr>";
  row = row + "<td>" + name + "</td>";
  row = row + "<td>" + m1 + "</td>";
  row = row + "<td>" + m2 + "</td>";
  row = row + "<td>" + m3 + "</td>";
  row = row + "<td>" + total + "</td>";
  row = row + "<td>" + percentage.toFixed(2) + "%</td>";
  row = row + "</tr>";

  document.getElementById("tableBody").innerHTML += row;

  document.getElementById("name").value = "";
  document.getElementById("m1").value = "";
  document.getElementById("m2").value = "";
  document.getElementById("m3").value = "";
}