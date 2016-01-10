Parse.initialize("E6NcavnlQIXSS8dxbd5j6jaceeZhV9snl2A7RmVp", "kcR3JVGoXWAiEuwiKMxex3RiIhvlRg8rC1McBlR2");

var pollResults = Parse.Object.extend("pollResults");
var pubnub;
var currentQuestion = "Q1";

pubnub = PUBNUB({
  publish_key: 'demo-36',
  subscribe_key: 'demo-36'
})

pubnub.time(
  function(time) {
    console.log(time)
  }
);

function pulishQuestion(questionId) {
  currentQuestion = questionId;
  publish(questionId);
}

function publish(questionId) {
  pubnub.publish({
    channel: 'hello_world',
    message: questionList[questionId],
    callback: function(m) {
      console.log(m)
    }
  });
}

function pubnubSubscribe() {
  console.log("Subscribing..");
  pubnub.subscribe({
    channel: "hello_world",
    message: function(message, env, ch, timer, magic_ch) {
      console.log(
        "Message Received." + '<br>' +
        "Channel: " + ch + '<br>' +
        "Message: " + JSON.stringify(message) + '<br>' +
        "Raw Envelope: " + JSON.stringify(env) + '<br>' +
        "Magic Channel: " + JSON.stringify(magic_ch)
      )
    },
    connect: pub
  })

  function pub() {
    console.log("Since we’re publishing on subscribe connectEvent, we’re sure we’ll receive the following publish.");
    pubnub.publish({
      channel: "hello_world",
      message: "Hello from PubNub Docs!",
      callback: function(m) {
        console.log(m)
      }
    })
  }
}
//createChart("Q2");

function createChart() {
  var query = new Parse.Query(pollResults);
  query.equalTo("QuestionId", currentQuestion);
  query.find({
    success: function(results) {
      var counts = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
      };
      _.each(results, function(item) {
        var response = item.get("Response");
        counts[response] = counts[response] ? counts[response] + 1 : 1;
      });
      console.log("counts are ", counts);
      var barChartData = {
        labels: ["A", "B", "C", "D"],
        datasets: [{
          fillColor: "rgba(220,120,220,0.5)",
          strokeColor: "rgba(220,20,220,0.8)",
          highlightFill: "rgba(20,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,132)",
          data: [counts["A"], counts["B"], counts["C"], counts["D"]]
        }]
      };
      var ctx = document.getElementById("canvas").getContext("2d");
      myBar = new Chart(ctx).Bar(barChartData, {
        responsive: true
      });
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}