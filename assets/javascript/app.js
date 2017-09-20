  // Initialize Firebase
var config = {
    apiKey: "AIzaSyAYCKZbeZcn-jeWswt4XW-SokibFLqoANU",
    authDomain: "trainschedule-e77f5.firebaseapp.com",
    databaseURL: "https://trainschedule-e77f5.firebaseio.com",
    projectId: "trainschedule-e77f5",
    storageBucket: "trainschedule-e77f5.appspot.com",
    messagingSenderId: "105906991540"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  

  //Add trains button
  $("#add-train-btn").on("click", function(event){
    event.preventDefault();
  

    //Get user inputs
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
    var trainFrequency = $("#frequency-input").val().trim();

    //create object to hold new train data
    var newTrain = {
      name: trainName,
      destination: destination,
      start: trainStart,
      frequency: trainFrequency
    };

    //Upload the data to Firebase
    database.ref().push(newTrain);

    //Log to console
    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.start);
    // console.log(newTrain.frequency);

    //CLEAR ALL INPUTS
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");

  });

  //Add train to database and add a row in the html
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;

    console.log(trainName);
    console.log(destination);
    console.log(trainStart);
    console.log(trainFrequency);

    //Train start time coming back from database
    var trainStartConverted = moment(trainStart, "HH:mm");
    console.log("TRAIN START:" + trainStartConverted);

     // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"))
    console.log("CURRENT TIME IN CODE: "+ currentTime.format("X"));

    //difference b/w time
    var diffTime = moment().diff(moment(trainStartConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    //remainder
    var timeRemainder = diffTime % trainFrequency;
    console.log("REMAINDER: "+timeRemainder);

    //frequency minus remainder to give minutes till next train
    var minutesAway = trainFrequency - timeRemainder;
    console.log("MINUTES AWAY: " + minutesAway);


    if(timeRemainder<0){
      var nextTrainMinutes = moment(trainStartConverted).diff(moment(), "minutes");
      var nextTrainArrival = trainStart;
    }else{

    //Next train arrival time
      var nextTrainMinutes = moment().add(minutesAway, "minutes");
      var nextTrainArrival = moment(nextTrainMinutes).format("HH:mm");
      console.log("NEXT TRAIN ARRIVAL TIME" + nextTrainArrival);
    }

    // Add each train's data into the table
    $("#employee-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    trainFrequency + "</td><td>" + nextTrainArrival + "</td><td>" + minutesAway + "</td></tr>");
  });















