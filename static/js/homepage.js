var challengesRef = db.collection('challenges');
var usersRef = db.collection('users');
var id = '-1';
var prevList = [];
getLeaderboard();

challengesRef.onSnapshot(snapshot => {
    snapshot.forEach(doc => {
        var data = doc.data();
        if (data.status == 'Started') {
            if (id != doc.id) {
                id = doc.id;
                initChallenge();
            }
        }
    })
});

async function initChallenge() {
    challengeRef = db.collection('challenges').doc(id);

    var playerOne = '';
    var playerTwo = '';

    await challengeRef.get().then(async function(doc) {
	    if (doc.exists) {
			var data = doc.data();

            setUpTimer();
            playerOne = await getName(data.playerOne);
            playerTwo = await getName(data.playerTwo);

            document.getElementById("p1Name").innerHTML = playerOne;
            document.getElementById("p1Points").innerHTML = 0;

            document.getElementById("p2Name").innerHTML = playerTwo;
            document.getElementById("p2Points").innerHTML = 0;

            playing = true;

            animateIn();

	        console.log("Player one:", playerOne);
            console.log("Player two:", playerTwo);
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});

    challengeRef.onSnapshot(async(doc) => {
        var data = doc.data();

        if (data.status == 'Finished') {
            playing = false;
            await loadResults(id);
            transitionToResults();
            setTimeout(transitionToLeaderboard, 15000);
            id = -1;
            // finishChallenge();
            // getLeaderboard();
        } else {
            // Points.
            var playerOnePoints = data.playerOnePoints.reduce((a, b) => a + b, 0);
            var playerTwoPoints = data.playerTwoPoints.reduce((a, b) => a + b, 0);

            document.getElementById("p1Points").innerHTML = playerOnePoints;
            document.getElementById("p2Points").innerHTML = playerTwoPoints;

            console.log(playerOnePoints);
            console.log(playerTwoPoints);

            // Current question.
            var playerOneProgress = data.playerOneProgress;
            var playerTwoProgress = data.playerTwoProgress;

            // TODO: Render information
        }
    });
}

async function getName(userID) {
    var name = "";
    await usersRef.doc(userID).get().then(doc => {
        var data = doc.data();
        name = data.name;
    }).catch(error => {
        console.log(error);
    });
    return name;
}

async function getLeaderboard() {
    var usersRef = db.collection('users').orderBy("points", "desc").limit(10);
    var currentList = [];

    await usersRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data()

            var name = data.name;
            var points = data.points;
            console.log(name, points);
            currentList.push([name, points]);
        });
    });

    if (currentList.join('') != prevList.join('')) {
        $("#playersList").fadeOut("fast");
        $("#playersList").promise().done(() => {
            document.getElementById("playersList").innerHTML = "";

            currentList.forEach((element, idx) => {
                create(idx+1, element[0], "4:20", element[1]);
            });

            for (let i = currentList.length; i < 10; i++) {
                create(-1, "", "", "");
            }

            $("#playersList").fadeIn("slow");
        })
    }

    prevList = currentList;
}

function startTimer() {
    var presentTime = document.getElementById('timer').innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var min = timeArray[0];
    var sec = checkSecond((timeArray[1] - 1));

    if (sec == 59) {
        --min;
    }

    if (min < 0) {
        document.getElementById('timer').innerHTML = "0:00";
    } else {
        document.getElementById('timer').innerHTML = min + ":" + sec;
        if (playing) {
            setTimeout(startTimer, 1000);
        }
    }
}
