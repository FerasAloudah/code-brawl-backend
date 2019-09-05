var playing = false;
var showingResult = false;

function animateIn() {
    $(".result1").animate({
        top: '52%'
    }, "slow");
    if (!showingResult) {
        $(".container").fadeIn("slow");
    }
}

function animateOut() {
    $(".container").fadeOut("slow");
    $(".result1").animate({
        top: '45%'
    }, "slow");
}

function transitionToResults() {
    showingResult = true;
    $("#table1").fadeOut("slow");
    $("#table1").promise().done(function() {
        $("#table2").fadeIn("slow");
    });
}

function transitionToLeaderboard() {
    showingResult = false;
    $("#table2").fadeOut("slow");
    $("#table2").promise().done(function() {
        if (!playing) {
            $(".container").css("display", "none");
            $(".result1").css("top", "45%");
        } else {
            $(".container").fadeIn("slow");
        }
        $("#table1").fadeIn("slow");
    });
}

function create(counter, name, time, points) {
    let list = document.getElementById("playersList");

    let tr = document.createElement("tr");
    tr.className = `tr${counter}`;
    list.appendChild(tr);

    if (counter == -1) {
        return;
    }

    let rank = counter;

    switch (counter) {
        case 1:
            rank = `<img src="/static/images/best.png" class="rank">`;
            break;
        case 2:
            rank = `<img src="/static/images/second.png" class="rank">`;
            break;
        case 3:
            rank = `<img src="/static/images/third.png" class="rank">`;
            break;
    }

    let rankElement = `<td class="table-rank">${rank}</td>`;
    $(`.tr${counter}`).append(rankElement);

    let nameElement = document.createElement("td");
    let nameNode = document.createTextNode(name);
    nameElement.setAttribute("class", "table-name");
    nameElement.appendChild(nameNode);

    let timeElement = document.createElement("td");
    let timeNode = document.createTextNode(time);
    timeElement.appendChild(timeNode);

    let pointsElement = document.createElement("td");
    let pointsNode = document.createTextNode(points);
    pointsElement.appendChild(pointsNode);

    tr.append(nameElement);
    tr.append(timeElement);
    tr.append(pointsElement);
}
