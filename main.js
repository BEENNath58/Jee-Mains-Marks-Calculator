// This function is to be used in an answer key console to generate answers object from it
// For the old answer keys which have option number in ascending order instead of the optionId of the correct option
function parseAnswerKey() {
    anskey = {}
    rows = document.getElementsByClassName("form-options-item");
    for (let i = 0; i < rows.length; i++) {
        questionId = rows[i].children[1].innerText;
        correctOption = parseInt(rows[i].children[2].innerText);
        anskey[questionId] = correctOption
    }
    return anskey
}

// For new answer keys with the option Id of the correct option
function newParseAnswerKey() {
    anskey = {}
    rows = document.getElementsByClassName("form-options-item");
    for (let i = 0; i < rows.length; i++) {
        questionId = rows[i].children[1].innerText;
        correctOption = rows[i].children[2].innerText;
        anskey[questionId] = correctOption
    }
    return anskey
}

// s is the answer key as a string, copied from the final answer key pdf given by nta
function pdfParseAnswerKey(s) {
    return s.split("\n").map(s => s.split(" ")).reduce((accumulator, current) => {
        accumulator[current[0]] = current[1];
        return accumulator
    }, {})
}

function marksCalculator(responses, anskey) {
    correctIncorrect = {
        "MAc": 0,
        "MBc": 0,
        "PAc": 0,
        "PBc": 0,
        "CAc": 0,
        "CBc": 0,
        "MAi": 0,
        "MBi": 0,
        "PAi": 0,
        "PBi": 0,
        "CAi": 0,
        "CBi": 0
    }

    subjectTables = {
        "MA": mathTable,
        "MB": mathTable,
        "PA": phyTable,
        "PB": phyTable,
        "CA": chemTable,
        "CB": chemTable
    }
    totalAttempted = 0

    for (let questionId of Object.keys(anskey).sort()) {
        option = anskey[questionId]
        subjectTable = subjectTables[responses[questionId][1]]
        row = subjectTable.insertRow()
        row.insertCell().innerText = questionId
        // console.log(responses[questionId])
        if (responses[questionId]) {
            // console.log(responses[questionId])
            if (responses[questionId][0] === "NA") {
                // console.log("Not attempted", responses[questionId])
                row.insertCell().innerText = responses[questionId][2] // type of question
                row.insertCell().innerText = "Not Attempted"
                row.insertCell().innerText = "NA"
                if (responses[questionId][2] === "MCQ") {
                    row.insertCell().innerText = responses[questionId][3][option - 1];
                } else {
                    row.insertCell().innerText = option;
                }
            } else if (responses[questionId][0] === "MCQ") {
                totalAttempted += 1
                // console.log(responses[questionId][2], responses[questionId][3], option)
                if (responses[questionId][2] === responses[questionId][3][option - 1]) { //correct
                    // console.log("CORRECT MCQ")
                    correctIncorrect[responses[questionId][1] + 'c'] += 1
                    row.insertCell().innerText = "MCQ"
                    row.insertCell().innerText = "Correct ✅"
                } else {
                    // console.log("incorrect mcq ", responses[questionId])
                    correctIncorrect[responses[questionId][1] + 'i'] += 1
                    row.insertCell().innerText = "MCQ"
                    row.insertCell().innerText = "Wrong ❌"
                }
                row.insertCell().innerText = responses[questionId][2]
                row.insertCell().innerText = responses[questionId][3][option - 1]

            } else if (responses[questionId][0] === "SA") {
                totalAttempted += 1
                if (parseInt(responses[questionId][2]) === option) { //correct
                    correctIncorrect[responses[questionId][1] + 'c'] += 1
                    row.insertCell().innerText = "SA"
                    row.insertCell().innerText = "Correct ✅"
                } else {
                    // console.log(typeof(responses[questionId][2]), typeof(option))
                    correctIncorrect[responses[questionId][1] + 'i'] += 1
                    row.insertCell().innerText = "SA"
                    row.insertCell().innerText = "Wrong ❌"
                }
                row.insertCell().innerText = responses[questionId][2];
                row.insertCell().innerText = option;
            }
        } else {
            console.log("WTF")
        }
    }
    // console.log(correctIncorrect)
    mathAscore = correctIncorrect["MAc"] * 4 - correctIncorrect["MAi"]
    mathBscore = correctIncorrect["MBc"] * 4 - correctIncorrect["MBi"]
    phyAscore = correctIncorrect["PAc"] * 4 - correctIncorrect["PAi"]
    phyBscore = correctIncorrect["PBc"] * 4 - correctIncorrect["PBi"]
    chemAscore = correctIncorrect["CAc"] * 4 - correctIncorrect["CAi"]
    chemBscore = correctIncorrect["CBc"] * 4 - correctIncorrect["CBi"]
    totalScore = mathAscore + mathBscore + phyAscore + phyBscore + chemAscore + chemBscore
    // console.log(mathAscore, mathBscore, phyAscore, phyBscore, chemAscore, chemBscore, totalScore)
    marksElement = document.getElementById("marks")
    marksElement.innerText = `Your total score is ${totalScore}\nMath section A score is ${mathAscore}\nMath section B score is ${mathBscore}\nPhysics section A score is ${phyAscore}\nPhysics section B score is ${phyBscore}\nChem section A score is ${chemAscore}\nChem section B score is ${chemBscore}`

    resultString = `\n
Total no. of questions attempted is ${totalAttempted}
Maths section A no. of correct is ${correctIncorrect["MAc"]}
Maths section A no. of incorrect is ${correctIncorrect["MAi"]}
Maths section B no. of correct is ${correctIncorrect["MBc"]}
Maths section B no. of incorrect is ${correctIncorrect["MBi"]}
Physics section A no. of correct is ${correctIncorrect["PAc"]}
Physics section A no. of incorrect is ${correctIncorrect["PAi"]}
Physics section B no. of correct is ${correctIncorrect["PBc"]}
Physics section B no. of incorrect is ${correctIncorrect["PBi"]}
Chemistry section A no. of correct is ${correctIncorrect["CAc"]}
Chemistry section A no. of incorrect is ${correctIncorrect["CAi"]}
Chemistry section B no. of correct is ${correctIncorrect["CBc"]}
Chemistry section B no. of incorrect is ${correctIncorrect["CBi"]}
`;
    marksElement.innerText += resultString;
}

// Thanks to nta releasing new format of ans keys, now I have to modify the original marksCalculator to this. Thankfully only two lines need to be changed
function newMarksCalculator(responses, anskey, responseSheetOrder) {
    // console.log("newMarksCalculator is running")
    correctIncorrect = {
        "MAc": 0,
        "MBc": 0,
        "PAc": 0,
        "PBc": 0,
        "CAc": 0,
        "CBc": 0,
        "MAi": 0,
        "MBi": 0,
        "PAi": 0,
        "PBi": 0,
        "CAi": 0,
        "CBi": 0,
    }

    mathTable = document.getElementById("maths")
    phyTable = document.getElementById("physics")
    chemTable = document.getElementById("chem")
    subjectTables = {
        "MA": mathTable,
        "MB": mathTable,
        "PA": phyTable,
        "PB": phyTable,
        "CA": chemTable,
        "CB": chemTable
    }
    totalAttempted = 0;
    droppedInAnskey = 0;
    dropAwardedList = [];

    for (let questionId of (sortInAscendingOrder ? Object.keys(anskey).sort() : responseSheetOrder)) {
        option = anskey[questionId]
        if (option === "Drop") {
            droppedInAnskey += 1
        }
        subjectTable = subjectTables[responses[questionId][1]]
        row = subjectTable.insertRow()
        row.insertCell().innerText = questionId
        // console.log(responses[questionId])
        if (responses[questionId]) {
            // console.log(responses[questionId])
            if (responses[questionId][0] === "NA") {
                // console.log("Not attempted", responses[questionId])
                row.insertCell().innerText = responses[questionId][2] // type of question
                if (option === "Drop" && responses[questionId][2] === "MCQ") {
                    dropAwardedList.push(questionId)
                    correctIncorrect[responses[questionId][1] + 'c'] += 1
                    row.insertCell().innerText = "Not Attempted and Dropped";
                } else {
                    row.insertCell().innerText = "Not Attempted";
                }
                row.insertCell().innerText = "NA"
            } else if (responses[questionId][0] === "MCQ") {
                totalAttempted += 1
                row.insertCell().innerText = "MCQ"
                // console.log(responses[questionId][2], responses[questionId][3], option)
                if (option === "Drop") {
                    dropAwardedList.push(questionId)
                    correctIncorrect[responses[questionId][1] + 'c'] += 1
                    row.insertCell().innerText = "Attempted and Dropped";
                } else if (responses[questionId][2] === option || (responses[questionId][2] === option.split(',')[1] || responses[questionId][2] === option.split(',')[0])) { //correct
                    // console.log("CORRECT MCQ")
                    correctIncorrect[responses[questionId][1] + 'c'] += 1
                    row.insertCell().innerText = "Correct ✅"
                } else {
                    // console.log("incorrect mcq ", responses[questionId][2], option)
                    correctIncorrect[responses[questionId][1] + 'i'] += 1
                    row.insertCell().innerText = "Wrong ❌"
                }
                row.insertCell().innerText = responses[questionId][2]

            } else if (responses[questionId][0] === "SA") {
                totalAttempted += 1
                row.insertCell().innerText = "SA"
                if (option === "Drop") {
                    dropAwardedList.push(questionId)
                    correctIncorrect[responses[questionId][1] + 'c'] += 1
                    row.insertCell().innerText = "Attempted and Dropped"
                } else if (parseInt(responses[questionId][2]) === parseInt(option)) { //correct
                    correctIncorrect[responses[questionId][1] + 'c'] += 1
                    row.insertCell().innerText = "Correct ✅"
                } else {
                    // console.log(typeof(responses[questionId][2]), typeof(option))
                    correctIncorrect[responses[questionId][1] + 'i'] += 1
                    row.insertCell().innerText = "Wrong ❌"
                }
                row.insertCell().innerText = responses[questionId][2]
            }
            row.insertCell().innerText = option;
        } else {
            console.log("WTF")
        }
    }
    // console.log(correctIncorrect)
    mathAscore = correctIncorrect["MAc"] * 4 - correctIncorrect["MAi"]
    mathBscore = correctIncorrect["MBc"] * 4 - correctIncorrect["MBi"]
    phyAscore = correctIncorrect["PAc"] * 4 - correctIncorrect["PAi"]
    phyBscore = correctIncorrect["PBc"] * 4 - correctIncorrect["PBi"]
    chemAscore = correctIncorrect["CAc"] * 4 - correctIncorrect["CAi"]
    chemBscore = correctIncorrect["CBc"] * 4 - correctIncorrect["CBi"]
    totalScore = mathAscore + mathBscore + phyAscore + phyBscore + chemAscore + chemBscore
    // console.log(mathAscore, mathBscore, phyAscore, phyBscore, chemAscore, chemBscore, totalScore)

    resultStrings = [
        `<strong>Your total score is ${totalScore}</strong>`,
        `Total no. of questions attempted is ${totalAttempted} (No. of correct also includes dropped questions for which you received marks) <hr>`,
        `<strong>Maths section A score is ${mathAscore}</strong>`,
        `<strong>Maths section B score is ${mathBscore}</strong>`,
        `Maths section A no. of correct is ${correctIncorrect["MAc"]}`,
        `Maths section A no. of incorrect is ${correctIncorrect["MAi"]}`,
        `Maths section B no. of correct is ${correctIncorrect["MBc"]}`,
        `Maths section B no. of incorrect is ${correctIncorrect["MBi"]} <hr>`,
        `<strong>Physics section A score is ${phyAscore}</strong>`,
        `<strong>Physics section B score is ${phyBscore}</strong>`,
        `Physics section A no. of correct is ${correctIncorrect["PAc"]}`,
        `Physics section A no. of incorrect is ${correctIncorrect["PAi"]}`,
        `Physics section B no. of correct is ${correctIncorrect["PBc"]}`,
        `Physics section B no. of incorrect is ${correctIncorrect["PBi"]} <hr>`,
        `<strong>Chemistry section A score is ${chemAscore}</strong>`,
        `<strong>Chemistry section B score is ${chemBscore}</strong>`,
        `Chemistry section A no. of correct is ${correctIncorrect["CAc"]}`,
        `Chemistry section A no. of incorrect is ${correctIncorrect["CAi"]}`,
        `Chemistry section B no. of correct is ${correctIncorrect["CBc"]}`,
        `Chemistry section B no. of incorrect is ${correctIncorrect["CBi"]} <hr>`,
        `Total no. of questions dropped in your answer key was: <strong>${droppedInAnskey}</strong>`,
        `You received marks for these dropped questions: <strong>${dropAwardedList.length === 0 ? "None" : String(dropAwardedList).replace(',', ", ")}</strong><hr> `
    ];

    for (i = 0; i < resultStrings.length; i++) {
        list_element = document.createElement("li");
        list_element.innerHTML = resultStrings[i];
        marksElement.append(list_element);
        // console.log(i)
    };

}


function getAnskey(responsecontent) {
    // var e = document.createElement("html");  // BAD method, don't ever use
    // e.innerHTML = responsecontent;
    // This is the correct way
    parser = new DOMParser()
    e = parser.parseFromString(responsecontent, "text/html");
    table = e.getElementsByClassName("main-info-pnl")[0].children[2].children[0]
    date = table.children[3].children[1].innerText
    time = table.children[4].children[1].innerText

    if (time === "3:00 PM - 6:00 PM") {
        return {
            "27/01/2024": mains27janshift2anskey,
            "29/01/2024": mains29janshift2anskey,
            "30/01/2024": mains30janshift2anskey,
            "31/01/2024": mains31janshift2anskey,
            "01/02/2024": mains1febshift2anskey
        } [date]
    } else {
        return {
            "27/01/2024": mains27janshift1anskey,
            "29/01/2024": mains29janshift1anskey,
            "30/01/2024": mains30janshift1anskey,
            "31/01/2024": mains31janshift1anskey,
            "01/02/2024": mains1febshift1anskey
        } [date]
    }
}

function getResponses(responsecontent, responseSheetOrder) {
    // var e = document.createElement("html");  // BAD method, don't ever use
    // e.innerHTML = responsecontent;
    // This is the correct way
    parser = new DOMParser()
    e = parser.parseFromString(responsecontent, "text/html")
    menutbls = e.getElementsByClassName("menu-tbl");
    responses = {};
    for (let i = 0; i < menutbls.length; i++) {
        sectionText = menutbls[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].textContent

        section = null
        if (sectionText.includes("Mathematics Section A")) section = "MA";
        if (sectionText.includes("Mathematics Section B")) section = "MB";
        if (sectionText.includes("Physics Section A")) section = "PA";
        if (sectionText.includes("Physics Section B")) section = "PB";
        if (sectionText.includes("Chemistry Section A")) section = "CA";
        if (sectionText.includes("Chemistry Section B")) section = "CB";

        elementText = menutbls[i].children[0].textContent;
        var questionIdRegex = /Question\s*ID\s*:\s*(\d+)/;
        var questionIdMatch = elementText.match(questionIdRegex);
        questionId = questionIdMatch[1];
        responseSheetOrder.push(questionId)
        // console.log(elementText)
        if (elementText.includes("Not Answered") || elementText.includes("Not Attempted")) {
            if (elementText.includes("MCQ")) {
                var option1IdRegex = /Option\s*1\s*ID\s*:\s*(\d+)/;
                var option2IdRegex = /Option\s*2\s*ID\s*:\s*(\d+)/;
                var option3IdRegex = /Option\s*3\s*ID\s*:\s*(\d+)/;
                var option4IdRegex = /Option\s*4\s*ID\s*:\s*(\d+)/;
                var chosenOptionRegex = /Chosen\s*Option\s*:\s*(\d+)/;

                var option1IdMatch = elementText.match(option1IdRegex);
                var option2IdMatch = elementText.match(option2IdRegex);
                var option3IdMatch = elementText.match(option3IdRegex);
                var option4IdMatch = elementText.match(option4IdRegex);
                optionIds = [option1IdMatch[1], option2IdMatch[1], option3IdMatch[1], option4IdMatch[1]]
                responses[questionId] = ["NA", section, "MCQ", optionIds.sort()]
            } else {
                responses[questionId] = ["NA", section, "SA"]
            }
        } else {
            if (elementText.includes("MCQ")) {
                var option1IdRegex = /Option\s*1\s*ID\s*:\s*(\d+)/;
                var option2IdRegex = /Option\s*2\s*ID\s*:\s*(\d+)/;
                var option3IdRegex = /Option\s*3\s*ID\s*:\s*(\d+)/;
                var option4IdRegex = /Option\s*4\s*ID\s*:\s*(\d+)/;
                var chosenOptionRegex = /Chosen\s*Option\s*:\s*(\d+)/;

                // var questionIdRegex = /Question\s*ID\s*:\s*(\d+)/;
                // var option1IdRegex = /Option\s*1\s*ID\s*:\s*(\d+)/;
                // var option2IdRegex = /Option\s*2\s*ID\s*:\s*(\d+)/;
                // var option3IdRegex = /Option\s*3\s*ID\s*:\s*(\d+)/;
                // var option4IdRegex = /Option\s*4\s*ID\s*:\s*(\d+)/;
                // var chosenOptionRegex = /Chosen\s*Option\s*:\s*(\d+)/;


                var option1IdMatch = elementText.match(option1IdRegex);
                var option2IdMatch = elementText.match(option2IdRegex);
                var option3IdMatch = elementText.match(option3IdRegex);
                var option4IdMatch = elementText.match(option4IdRegex);
                optionIds = [option1IdMatch[1], option2IdMatch[1], option3IdMatch[1], option4IdMatch[1]]
                var chosenOptionMatch = elementText.match(chosenOptionRegex);
                chosenOptionId = optionIds[parseInt(chosenOptionMatch[1]) - 1]
                responses[questionId] = ["MCQ", section, chosenOptionId, optionIds.sort()]

            } else {
                questiontbl = menutbls[i].parentElement.children[0]
                ansText = questiontbl.innerText;
                var ansRegex = /(?:Q\.\d+)?\s*Given Answer\s*:\s*(-?\d+)/;
                var ansMatch = ansText.match(ansRegex);
                // console.log(ansText)
                if (ansMatch === null) {
                    console.log(ansText, "<<< this is ansText")
                } else {
                    ans = ansMatch[1];
                }
                // console.log("ans is ", ans)
                responses[questionId] = ["SA", section, ans];

            }
        }


        // responses[questionId] = [optionIdValue, optionIds]
        // console.log("hi", responses)
    }
    return responses
}


fileElement = document.getElementById("fileElement")
button = document.getElementById("button")
fileElement.onchange = () => {
    // console.log(responsesheet)
    responsesheet = fileElement.files[0];
    // console.log(responsesheet)
    if (responsesheet) {
        // console.log(responsesheet)
        var reader = new FileReader();
        reader.readAsText(responsesheet, "UTF-8");
        reader.onload = function(evt) {
            // console.log(evt.target.result);
            responsecontent = evt.target.result;
            responseSheetOrder = []
            responses = getResponses(responsecontent, responseSheetOrder)
            // console.log(responseSheetOrder)
            anskey = getAnskey(responsecontent)
            // console.log(anskey)
            newMarksCalculator(responses, anskey, responseSheetOrder)
        }
        reader.onerror = function(evt) {
            console.log("error reading file");
        }
    } else {
        console.log("wtf")
    }
}

mathTable = document.getElementById("maths");
phyTable = document.getElementById("physics");
chemTable = document.getElementById("chem");

marksElement = document.getElementById("marks");

responses = null;
anskey = null;
responseSheetOrder = null;
sortInAscendingOrder = true;

function questionSort() {
    scrollPos = {
        x: window.scrollX,
        y: window.scrollY
    }
    mathTable.innerHTML = mathTable.rows[0].innerHTML;
    phyTable.innerHTML = phyTable.rows[0].innerHTML;
    chemTable.innerHTML = chemTable.rows[0].innerHTML;
    marksElement.innerHTML = "";
    newMarksCalculator(responses, anskey, responseSheetOrder);
    scroll(scrollPos.x, scrollPos.y)
}

function getResultPDF() {
    var marksContents = document.getElementById("marks").innerHTML;
    var resultContents = document.getElementById("result").innerHTML;
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Answers</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />');
    printWindow.document.write('</head><body style="padding: 50px;">');
    printWindow.document.write('<style>.subject{font-weight:700;font-size:larger;text-align:center}.subjecttable{width:100%}td,th{border:1px solid}tr:nth-child(2n){background-color:#f6f6f6}tr:nth-child(odd){background-color:#f2f2f2}</style>');
    printWindow.document.write(marksContents + resultContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
};