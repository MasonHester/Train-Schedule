$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAOd7LjUzZzXOEJchN4MZFkD6D7xP1bP40",
        authDomain: "train-schedule-727f0.firebaseapp.com",
        databaseURL: "https://train-schedule-727f0.firebaseio.com",
        projectId: "train-schedule-727f0",
        storageBucket: "train-schedule-727f0.appspot.com",
        messagingSenderId: "1094724368020"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    function submitData() {
        event.preventDefault();

        let trainName = $("#trainNameInput").val().trim();
        let trainDestination = $("#trainDestinationInput").val().trim();
        let trainFirstTime = $("#trainFirstTimeInput").val().trim();
        let trainFrequency = $("#trainFrequencyInput").val().trim();

        let trainJSON = {
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstTime: trainFirstTime,
            trainFrequency: trainFrequency
        }

        // database.ref("trains/" + trainName).push();
        // database.ref("trains/" + trainName).set(trainJSON);

        database.ref().push(trainJSON);

        $("form")[0].reset();
    }

    database.ref().on("child_added", function(childSnapshot) {

        let name = childSnapshot.val().trainName;
        let destination = childSnapshot.val().trainDestination;
        let frequency = childSnapshot.val().trainFrequency;

        let currentTime = moment();

        let firstTime = moment(childSnapshot.val().trainFirstTime, "hh:mm").subtract(1, "year");

        let timeDifference = currentTime.diff(moment(firstTime), "minutes")

        let remainingTime = timeDifference % frequency;

        let minutesAway = frequency - remainingTime;

        let nextTime = currentTime.add(minutesAway, "minutes");
        let nextArrival = moment(nextTime).format("hh:mm A");

        const tableRow = $("<tr>");
        const nameCol = $("<td>");
        const destinationCol = $("<td>");
        const frequencyCol = $("<td>");
        const nextArrivalCol = $("<td>");
        const minutesAwayCol = $("<td>");
        const removeCol = $("<td>");

        nameCol.text(name);
        destinationCol.text(destination);
        frequencyCol.text(frequency);
        nextArrivalCol.text(nextArrival);
        minutesAwayCol.text(minutesAway);
        removeCol.text("x");

        tableRow.append(nameCol, destinationCol, frequencyCol, nextArrivalCol, minutesAwayCol, removeCol).attr("data-train-name", name);
        $(".tableBody").append(tableRow);
    });


    $(".submitButton").on("click", submitData);
});