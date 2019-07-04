var button = document.getElementById("Login");

button.addEventListener("click", () => {
findChallenge();
swal({
    title: "You successfully joined the room!",
    text: " Waiting for your friend!",
    icon: "success",
    button: "Cancel",
  }).then(() => {
      cancelChallenge();
  })
})

var currentChallenge = null;
var challengeListener = null;

async function findChallenge() {
    var challenges = db.collection("challenges").where("status", "==", 'Waiting');
	var challengeFound = false;

    await challenges.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data()
            console.log(doc.id, ' => ', data);

            if (data.status == 'Waiting') {
                joinChallenge(doc.id);
                challengeFound = true;
            }
        });
    });

    if (!challengeFound) {
        createChallenge();
    }
}

function createChallenge() {
    var name = document.getElementById("name").value;
    var data = {
        'playerOne': name,
        'points': [0, 0],
        'questions': generateQuestions(),
        'status': 'Waiting',
        'progress': [0, 0]
    }

    var newChallengeRef = db.collection("challenges").doc();

	newChallengeRef.set(data)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });;

    currentChallenge = newChallengeRef;

    newChallengeRef.onSnapshot(function(doc) {
        data = doc.data();
        if (data.status == 'Started') {
            console.log(doc.data().playerTwo + ' Joined!');
            // Change page.
        }
    });
}

function joinChallenge(id) {
    var challengeRef = db.collection("challenges").doc(id);
    var name = document.getElementById("name").value;

    challengeRef.update({
        'playerTwo': name,
        'status': 'Started',
        'startingTime': firebase.firestore.FieldValue.serverTimestamp(),
        'playerOneTime': firebase.firestore.FieldValue.serverTimestamp(),
        'playerTwoTime': firebase.firestore.FieldValue.serverTimestamp()
    });

    challengeRef.get().then(function(doc) {
	    if (doc.exists) {
			console.log('You Joined ' + doc.data().playerOne + '!');
	        console.log("Document data:", doc.data());
            // Change page.
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
}

function cancelChallenge() {
    currentChallenge.delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function generateQuestions() {
    var questions = []
    while (questions.length < 3) {
        var question = Math.floor(Math.random() * 30);
        if (questions.indexOf(question) === -1) {
            questions.push(question);
        }
    }
    return questions;
}
