$(document).ready(function () {

//=====================================================================================================================

//              Firebase

//=====================================================================================================================

//                  Initializing

//---------------------------------------------------------------------------------------------------------------------

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

//---------------------------------------------------------------------------------------------------------------------

//                  Interactions

//---------------------------------------------------------------------------------------------------------------------

    // When a child is added to the trains branch
    database.ref("trains/").on("child_added", function(childSnapshot) {

        // Grabs the values needed from the data-base
        let name = childSnapshot.val().trainName;
        let destination = childSnapshot.val().trainDestination;
        let frequency = childSnapshot.val().trainFrequency;

        // Grabs the current time
        let currentTime = moment();

        // Formats the first time and subtracts one year
        let firstTime = moment(childSnapshot.val().trainFirstTime, "hh:mm").subtract(1, "year");

        // Finds the difference between the first time and now
        let timeDifference = currentTime.diff(moment(firstTime), "minutes");

        // Finds the remainder of the differnece and the frequency
        let remainingTime = timeDifference % frequency;

        // Finds the minutes away by subtracting the remaing time from the frequency
        let minutesAway = frequency - remainingTime;

        // Finds the next time by adding how far away to what time it is
        let nextTime = currentTime.add(minutesAway, "minutes");

        // Formats it properly
        let nextArrival = moment(nextTime).format("hh:mm A");

        // Shorthands for making the table
        const tableRow = $("<tr>");
        const nameCol = $("<td>");
        const destinationCol = $("<td>");
        const frequencyCol = $("<td>");
        const nextArrivalCol = $("<td>");
        const minutesAwayCol = $("<td>");

        // Puts the data in the table
        nameCol.text(name);
        destinationCol.text(destination);
        frequencyCol.text(frequency);
        nextArrivalCol.text(nextArrival);
        minutesAwayCol.text(minutesAway);

        // Creates the table
        tableRow.append(nameCol, destinationCol, frequencyCol, nextArrivalCol, minutesAwayCol).attr("data-train-name", name);

        // Puts the table on the HTML
        $(".tableBody").append(tableRow);
    });

//=====================================================================================================================

//              Functions

//=====================================================================================================================

//                  Waiting for calls

//---------------------------------------------------------------------------------------------------------------------

    // Called when submit data is clicked
    function submitData() {
        // Prevents the form from refreshing the page on submission
        event.preventDefault();

        // Grabs the input from the HTML
        let trainName = $("#trainNameInput").val().trim();
        let trainDestination = $("#trainDestinationInput").val().trim();
        let trainFirstTime = $("#trainFirstTimeInput").val().trim();
        let trainFrequency = $("#trainFrequencyInput").val().trim();

        // A JSON object to store the input
        let trainJSON = {
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstTime: trainFirstTime,
            trainFrequency: trainFrequency
        }

        // Pushes the JSON object to the firebase
        database.ref("trains/").push(trainJSON);

        // Resets the form
        $("form")[0].reset();
    }

    // Called when reset data is clicked
    function resetData() {
        // Removes the trains branch in the data-base (taking the childs with it)
        database.ref("trains").remove();

        // Empties the table to reflect this
        $(".tableBody").empty();
    }

//---------------------------------------------------------------------------------------------------------------------

//                  Instantly called

//---------------------------------------------------------------------------------------------------------------------

    // Also called internally
    function updateTimer() {
        // Grabs the current time and formats it
        let timeForDisplay = moment().format("hh:mm:ss A");

        // Writes the time on the HTML
        $(".timeDisplay").text(timeForDisplay);
        
        // Calls the function again after one second
        setTimeout(updateTimer, 1000);
    }

//=====================================================================================================================

//              On Clicks

//=====================================================================================================================

    // Submits data
    $(".submitButton").on("click", submitData);

    // Resets data
    $(".resetButton").on("click", resetData);

//=====================================================================================================================

//              On Page Load Calls

//=====================================================================================================================

    // Starts updating the timer
    updateTimer();
});