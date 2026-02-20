/* New Round */
const newRound = document.querySelector('#new-round');
const table = document.querySelector('#new-round-table');
const addPlayerRow = document.querySelector('#add-player')
const addPlayerTable = document.querySelector('#add-player-table')


const confirmPlayerButton = document.querySelector('.confirm-player-button');
const deletePlayerButton = document.querySelector('.delete-player-button');
const editPlayerButton = document.querySelector('#edit-player-button');
const addPlayerButton = document.querySelector('#add-player-button');
const distanceMode = document.querySelector('#distance-mode-checkbox')

const players = [];
let playersInOrder

let multiplierOn;

const savesPlayer = (el) => {
    const row = el.closest('.new-round__table-row');
    const id = row.querySelector('.id-cell')
    const input = row.querySelector('.name-cell input')
    const name = input.value.trim();
    const buttons = row.querySelector('.button-cell')
    const nameCell = row.querySelector('.name-cell');

    if (players[+id.textContent - 1]) {
        nameCell.textContent = name
        buttons.innerHTML = '<button type="button" id="edit-player-button" onclick="editPlayer(this)"><img src="./images/edit.png" alt="trash can" width="20"></button>'
    }else if (name.length > 0) {
        nameCell.textContent = name
        players.push({ id: +id.textContent, name: name, scores: {}})
        buttons.innerHTML = '<button type="button" id="edit-player-button" onclick="editPlayer(this)"><img src="./images/edit.png" alt="trash can" width="20"></button>'
    }else {
        console.log('no name')
        /* and error effect when name isnt filled out */
    }
}

const editPlayer = (el) => {
    const row = el.closest('.new-round__table-row');
    const nameCell = row.querySelector('.name-cell');
    const name = nameCell.innerText
    const buttons = row.querySelector('.button-cell')

    nameCell.innerHTML = `<input class="added-player__custom" type="text" name="name" placeholder="Name" value="${name}">`;
    buttons.innerHTML = `
        <button type="button" class="delete-player-button" onclick="deletePlayer(this)"><img src="./images/delete.png" alt="trash can" width="20"></button>
        <button type="button" class="confirm-player-button | prime-text" onclick="savesPlayer(this)">&#x2713</button>
        `
}

const updatePlayerId = () => {
    players.forEach((player, index) => player.id = index + 1)
}

const updatePlayerNumber = () => {
    const addedPlayers = document.querySelectorAll('.new-round__table-row');
    addedPlayers.forEach((player, index) => {
        id = player.querySelector('.id-cell');
        if (id) {
            id.textContent = index + 1
        }

    })
    updatePlayerId()
}

const addsPlayer = () => {
    const newPlayer = `
    <div class="new-round__table-row | dark-text">
        <p class="id-cell"></p>
        <div class="name-cell"><input class="added-player__custom" type="text" name="name" placeholder="Name"></div>
        <div class="button-cell">
            <button type="button" class="delete-player-button" onclick="deletePlayer(this)"><img src="./images/delete.png" alt="trash can" width="20"></button>
            <button type="button" class="confirm-player-button" onclick="savesPlayer(this)">&#x2713</button>
        </div>
    </div>
    `

    addPlayerTable.innerHTML += newPlayer
    updatePlayerNumber()
}

const deletePlayer = (el) => {
    const row = el.closest('.new-round__table-row')
    const id = row.querySelector('.id-cell').textContent
    const indexToRemove = players.findIndex(player => player.id === +id)

    if (indexToRemove > -1) {
        players.splice(indexToRemove, 1) 
    }
    row.remove()

    updatePlayerNumber()
}


addPlayerButton.addEventListener('click', () => {
    addsPlayer()
})

/* start round functions */

const inGame = document.querySelector('#in-game')
const startRoundButton = document.querySelector('#start-round-btn');

const targetList = document.querySelector('#target-list');
const targetListItems = document.querySelectorAll('.in-game__target-select');
const currentTarget = document.querySelector('#target-number-span');
const targetExpandButton = document.querySelector('#target-expand-btn');
const targetsContainer = document.querySelector('.in-game__target-container');
const targetsList = document.querySelector('.in-game__target-select-ol');

const distanceInput = document.querySelector('#yard-input')
const scoreSetterBox = document.querySelector('#score-setter-container');
const distanceErroeMessage = document.querySelector('#yardage-error-msg')

const nextTargetButton = document.querySelector('#next-target-btn');
const previousTargetButton = document.querySelector('#previous-target-btn');
const firstEndRoundButton = document.querySelector('#end-round-btn')
const cancelEndRoundButton = document.querySelector('#confirm-msg-cancel')
const scorecardButton = document.querySelector('#scorecard-btn');

const scorecard = document.querySelector('#scorecard');
const scorecardTotalColumn = document.querySelector('#scorecard-net');
const scorecardMultipliedColumn = document.querySelector('#scorecard-multiplied')
const scorecardPlayerContainer = document.querySelector('#scorecard-player-container')


let target = 0;
const distances = {}




const changesScreenToStartRound = () => {
    const inGameHidden = inGame.hasAttribute('hidden')
    
    if (inGameHidden) {
        newRound.setAttribute('hidden', '')
        inGame.removeAttribute('hidden')
    }
}

const adjustsGapOfScoreBox = (num) => {
    const distanceContainer = document.querySelector('.in-game__yardage-container');
    const scoreContainer = document.querySelector('.in-game__target-score-container');
    if (num === 3) {
        distanceContainer.style.marginBlockStart = '8rem';
        scoreContainer.style.margin = '2rem auto';
    }else if (num >= 4) {
        distanceContainer.style.marginBlockStart = '7.5rem';
        scoreContainer.style.margin = '1rem auto';
    }
}

const populateScoreSetterBox = () => {
    players.forEach(player => {
        scoreSetterBox.innerHTML += `
            <div class="in-game__target-score-row" id="player-${player.id}">
                <p class="in-game__target-score-id">${player.id}</p>
                <p class="in-game__target-score-player">${player.name}</p>
                <div class="in-game__target-score-buttons">
                    <button type="button" class="in-game__target-score" value="10">10</button>
                    <button type="button" class="in-game__target-score" value="8">8</button>
                    <button type="button" class="in-game__target-score" value="5">5</button>
                    <button type="button" class="in-game__target-score" value="3">3</button>
                    <button type="button" class="in-game__target-score" value="0">0</button>
                </div>
            </div>
        `
    })
}

const addPlayerToScorecard = () => {
    players.forEach(player => {
        const newName = String(player.name).split(/\s+/).join('-')

        const playerDiv = document.createElement('div');
        playerDiv.className = 'in-game__scorecard-row-player'
        playerDiv.id = `${newName}`;
        playerDiv.innerHTML = `<p class="in-game__scorecard-name-player">${player.name}</p>`
        scorecardPlayerContainer.appendChild(playerDiv)

        const totalPar = document.createElement('p');
        totalPar.className = 'in-game__scorecard-number-total'
        totalPar.id = `${newName}-total`
        totalPar.textContent = '0'
        scorecardTotalColumn.appendChild(totalPar)

        if (multiplierOn) {
            const multiplierPar = document.createElement('p');
            multiplierPar.className = 'in-game__scorecard-multiplied-total'
            multiplierPar.id = `${newName}-multiplied`
            multiplierPar.textContent = '0'
            scorecardMultipliedColumn.appendChild(multiplierPar)
        }
    })
}

const handlesIfMultiplierMode = () => {
    const scorecarTotalsContainer = document.querySelector('.in-game__scorecard-total')
    const scorecardNotTotalsContainer = document.querySelector('.in-game__scorecard-not-total')

    if (multiplierOn) {
        players.forEach(player => {
            player.multipliedScores = {}
        })
    }

    if (!multiplierOn) {
        scorecardMultipliedColumn.style.display = 'none'
        scorecarTotalsContainer.style.gridTemplateColumns = '1fr'
        scorecarTotalsContainer.style.width = '20%'
        scorecardNotTotalsContainer.style.width = '80%'
    }
}

/* expand target list */

const showTargetListToggle = () => {
    let open = targetsContainer.classList.contains('open');
    if (open) {
        targetsContainer.classList.remove('open');
        setTimeout(() => {
          targetsList.style.display = "none"  
        }, 500)
        
    }else {
        targetsContainer.classList.add('open')
        targetsList.style.display = "flex"
    }
}

/* scorecard toggle */

const toggleScorecard = () => {
    const open = scorecard.hasAttribute('open');
    if (!open) {
        scorecard.setAttribute('open', '')
    }else {
        scorecard.removeAttribute('open')
    }
}

const noDistanceError = (error) => {
    error ? distanceErroeMessage.style.display = 'block' : distanceErroeMessage.style.display = 'none'
}



/* controls scoring system */

/* create functions just initializes a new {target: score}. May be able to combine createScore and updateScore into one function. */
const createsScore = () => {
    players.forEach(player => {
        player.scores[target] = 0
        if (multiplierOn) {
           player.multipliedScores[target] = 0 
        }
        
    })
}

const createDistance = () => {
    distances[target] = 0
} 

const updateDistance = () => {
    distances[+currentTarget.textContent] = +distanceInput.value
}
/* update functions update the data inside the object every time a new value is given on that target to each score/distance */
const updateScore = (btn) => {
    const player = btn.closest('.in-game__target-score-row')
    const id = player.getAttribute('id').split("").slice(7, 8).join('')
    players[+id - 1].scores[target] = +btn.value
    console.log(distances[target] % 10)

    if (multiplierOn) {
        const multipliedScore = (distances[target] < 20) ? +btn.value : +btn.value * (distances[target] * 0.05)
        console.log(multipliedScore.toFixed(1))
        players[+id - 1].multipliedScores[target] = +multipliedScore.toFixed(1)
    }
}

const putsPlayersInOrder = () =>  playersInOrder = [...players].sort((a, b) => b.total - a.total);

const highlightSelectedScore = (btn) => {
    const buttonsContainer = btn.closest('.in-game__target-score-buttons')
    const buttons = buttonsContainer.querySelectorAll('.in-game__target-score');
    buttons.forEach(button => {
        button.classList.remove('selected')
    })
    btn.classList.add('selected')
}
/* too long? should I break it up into smaller functions? */
const addColumnsToScorecard = () => {
    const targetRow = scorecard.querySelector('#scorecard-target-row');
    const distanceRow = scorecard.querySelector('#scorecard-distance-row');
    const playersRows = scorecard.querySelectorAll('.in-game__scorecard-row-player')

    const targetCol = document.createElement('p');
    targetCol.className = 'in-game__scorecard-number-target';
    targetCol.textContent = `#${target}`;
    targetRow.appendChild(targetCol);
    
    const distanceCol = document.createElement('p');
    distanceCol.className = 'in-game__scorecard-number-distance';
    distanceCol.id = `distance-column-${target}`
    distanceRow.appendChild(distanceCol)

    playersRows.forEach(player => {
        const playerCol = document.createElement('p');
        playerCol.className = 'in-game__scorecard-number-player';
        playerCol.id = `player-column-${target}`
        player.appendChild(playerCol)
        
    })
}

const updateDistanceToScorecard = () => {
    const currentTarg = currentTarget.textContent;
    const distanceColumns = scorecard.querySelectorAll('.in-game__scorecard-number-distance')

    distanceColumns.forEach(column => {
        const columnId = column.getAttribute('id').split("").slice(16, 17).join('')
        
        if (currentTarg === columnId) {
            column.textContent = `${distanceInput.value}yrds`
        }
    })
}

const updatePlayerScoreToScorecard = (btn) => {
    const currentTarg = currentTarget.textContent;
    const player = btn.closest('.in-game__target-score-row');
    const playerName = player.querySelector('.in-game__target-score-player').textContent
    const scorecardPlayer = scorecardPlayerContainer.querySelector(`#${playerName.trim().replace(' ', '-')}`)
    const scorecardPlayerCol = scorecardPlayer.querySelectorAll('.in-game__scorecard-number-player')
    scorecardPlayerCol.forEach(column => {
        const columnId = column.getAttribute('id').split("").slice(14, 15).join('')

        if (currentTarg === columnId) {
            column.textContent = btn.value
        }
    })
}

const updateTotalScorecardScores = () => {
    const netTotalRows = scorecardTotalColumn.querySelectorAll('.in-game__scorecard-number-total');
    const multipliedTotalRows = scorecardMultipliedColumn.querySelectorAll('.in-game__scorecard-multiplied-total')
    /* TRY: add total from players data and use that to update each  */
    netTotalRows.forEach(row => { 
        const rowName = row.getAttribute('id').split('').slice(0, -6).join('').replace('-', ' ').trim()
        const playersData = players.filter(player => player.name === rowName)
        const totals = Object.values(playersData[0].scores).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        /* changed to see if adding a total in players makes things easier */
        row.textContent = totals
        playersData[0].total = totals
    })

    if (multiplierOn) {
        multipliedTotalRows.forEach(row => {
            const rowName = row.getAttribute('id').split('').slice(0, -11).join('').replace('-', ' ').trim();
            const playersData = players.filter(player => player.name === rowName)
            
            row.textContent = +Object.values(playersData[0].multipliedScores).reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(1)
        })
    }
}

/* updateByTarget functions bring show the current score in the UI based off data from the objects. create/update/updateByTarget functions may be able to get combine in the
future but for now they work good alone and might work best alone. */
const updateDistanceByTarget = () => {
    if (!distances[target]) {
        distanceInput.value = ''
    }else {
        distanceInput.value = distances[target]
    }
}

/* I am proud of this one */
const updateScoreByTarget = () => {
    const buttons = document.querySelectorAll('.in-game__target-score');
    players.forEach(player => {
        if (!player.scores[target]) {
            buttons.forEach(button => button.classList.remove('selected'))
            return
        }
        const playerRow = scoreSetterBox.querySelector(`#player-${player.id}`)
        const playersScoreButton = playerRow.querySelector(`[value="${player.scores[target]}"]`)
        highlightSelectedScore(playersScoreButton)
    })
}

/* add/changes targets */

const selectTarget = (el) => {
    let items = targetList.querySelectorAll('.in-game__target-select');
    items.forEach(item => item.classList.remove('selected'))
    el.classList.add('selected');
    currentTarget.textContent = el.textContent
    updateScoreByTarget()
    updateDistanceByTarget()
}

const addTarget = () => {
    target++
    currentTarget.textContent = target;
    const li = document.createElement('li');
    li.className = 'in-game__target-select';
    li.textContent = target;
    targetList.appendChild(li)
    selectTarget(li)
    createsScore()
    createDistance()
    addColumnsToScorecard()
}

const selectsNextTarget = () => {
    let items = Array.from(targetList.querySelectorAll('.in-game__target-select'))
    let indexOfSelected = items.findIndex(item => item.classList.contains('selected'))

    if (multiplierOn && distances[target] === 0) {
        noDistanceError(true)
        return
    }

    if (items.length === indexOfSelected + 1) {
        addTarget()
    }else {
        selectTarget(items[indexOfSelected + 1])
        target++
        updateScoreByTarget()
        updateDistanceByTarget()
    }

    
}
/* try to make these into one function in the future */
const selectsPreviousTarget = () => {
    let items = Array.from(targetList.querySelectorAll('.in-game__target-select'))
    let indexOfSelected = items.findIndex(item => item.classList.contains('selected'))


    if (indexOfSelected === 0) {
        return 
    }else if (multiplierOn && distances[target] === 0) {
            noDistanceError(true)
            return
    }else {
        selectTarget(items[indexOfSelected - 1])
        target--
        updateScoreByTarget()
        updateDistanceByTarget()
    }
}


distanceInput.addEventListener('change', () => {
    const selectedButtons = scoreSetterBox.querySelectorAll('.in-game__target-score.selected')
    updateDistance()
    updateDistanceToScorecard()
    selectedButtons.forEach(button => {
        updateScore(button)
    })
    updateTotalScorecardScores()
    noDistanceError(false)
})

scoreSetterBox.addEventListener('click', (e) => {
    const button = e.target.closest('.in-game__target-score')
    if (!button) return
    updateScore(button)
    highlightSelectedScore(button)
    updatePlayerScoreToScorecard(button)
    updateTotalScorecardScores()
    putsPlayersInOrder()
    console.log(playersInOrder)

})

startRoundButton.addEventListener('click', () => {
    const childrenOfAddPlayerTable = addPlayerTable.children;

    distanceMode.checked ? multiplierOn = true : multiplierOn = false
    console.log(childrenOfAddPlayerTable)
    if (childrenOfAddPlayerTable.length !== players.length || players.length === 0) {
        console.log("add players")
        return
    }else {
        handlesIfMultiplierMode()
        populateScoreSetterBox()
        addPlayerToScorecard()
        addTarget() 
        changesScreenToStartRound()
        adjustsGapOfScoreBox(numberOfPlayersAdded)
    }
    
})

targetList.addEventListener('click', (e) => {
    const li = e.target.closest('.in-game__target-select')
    if (!li || !targetList.contains(li)) return
    target = +li.textContent
    selectTarget(li)
})

targetExpandButton.addEventListener('click', () => {
    showTargetListToggle()
})

scorecardButton.addEventListener('click', () => {
    toggleScorecard()
})

firstEndRoundButton.addEventListener('click', () => {
    const confirmPopUp = document.querySelector('#end-confirm');
    confirmPopUp.style.display = 'flex'
})

cancelEndRoundButton.addEventListener('click', () => {
    const confirmPopUp = document.querySelector('#end-confirm');
    confirmPopUp.style.display = 'none'
})

/* Round Summary */

const roundSummary = document.querySelector('#round-summary')
const endRound = document.querySelector('#confirm-msg-confirm');



const halfWayPoint = () => {
    const totalAmountOfTargets = Object.keys(players[0].scores).length
    return Math.floor(totalAmountOfTargets / 2)
}



const populatePodium = () => {
    const podium1 = document.querySelector('#podium-1 p');
    const podium2 = document.querySelector('#podium-2 p');
    const podium3 = document.querySelector('#podium-3 p');
    let spliceLength
    
    (playersInOrder.length < 3) ? spliceLength = playersInOrder.length : spliceLength = 3

    const topThree = [...playersInOrder].splice(0, spliceLength);

    podium1.textContent = topThree[0].name;
    if (spliceLength === 2) {
        podium2.textContent = topThree[1].name;
    }else if (spliceLength == 3) {
        podium2.textContent = topThree[1].name;
        podium3.textContent = topThree[2].name;
    }
}


const populateResultsTable = () => {
    const resultsTable = document.querySelector('#results-table');

    playersInOrder.forEach(player => {
        const amountOfDivs = document.querySelectorAll('.round-summary__results-row').length
        let place
        if (amountOfDivs === 0) {
            place = '1st'
        }else if (amountOfDivs === 1) {
            place = '2nd'
        }else if (amountOfDivs === 2) {
            place = '3rd'
        }else place = `${amountOfDivs}th`

        resultsTable.innerHTML += `
            <div class="round-summary__results-row">
                <p class="round-summary__results-place">${place}</p>
                <p class="round-summary__results-name">${player.name}</p>
                <p class="round-summary__results-score">${player.total}</p>
            </div>
        `
        
    })
}

const findsMosts = (num) => {

    const playersTens = []
    players.forEach(player => {
        let tensCount = 0
        Object.values(player.scores).map(score => {
            if (score === num) {
                tensCount++
            }
        })
        playersTens.push({name: player.name, amount: tensCount})
    })
    return playersTens.sort((a, b) => b.amount - a.amount)[0]
}

const populateMosts = () => {
    const mostTens = document.querySelector('#most-tens p')
    const mostZeros = document.querySelector('#most-zeros p')
    if (players.length === 1) {
        mostTens.textContent = findsMosts(10).amount === 0 ? "You didn't get any tens" : `You got ${findsMosts(10).amount} 10s. Nice Job!`
        mostZeros.textContent = findsMosts(0).amount ? "You didn't get a single 0! Well done" : `You got ${findsMosts(0).amount} 0s.`
    }else {
        mostTens.textContent = findsMosts(10).amount === 0 ? "Most 10s in the round: Nobody. Everyone go home and practice" : `Most 10s in the round: ${findsMosts(10).name} with ${findsMosts(10).amount}.`
        mostZeros.textContent = findsMosts(0).amount === 0 ? "Most 0s in the round: Nobody! Nice shooting everyone" : `Most 0s in the round: ${findsMosts(0).name} with ${findsMosts(0).amount}.`
    }
}

const findsAndPopulatesLongestShot = () => {
    const longestShotText = document.querySelector('#longest-shot p')
    const longestDistance = Math.max(...Object.values(distances))
    const longestTarget = String(Object.values(distances).indexOf(longestDistance) + 1)
    const scoresFromLongest = []
    /* pulls all scores on the longest target */
    players.forEach(player => {
        scoresFromLongest.push({name: player.name, score: player.scores[longestTarget]})
    })
    /* sorts scores from highest to lowest, then checks if there are multiple people with the highest score on the longest target */
    scoresFromLongest.sort((a, b) => b.score - a.score)
    const highestScore = scoresFromLongest[0].score
    const ifTie = scoresFromLongest.filter(each => each.score === highestScore)
    if (players.length === 1) {
        longestShotText.textContent = `Your longest shot of the day was ${longestDistance}yrds and you scored a ${scoresFromLongest.score}`
    }else if (ifTie.length > 1) {
        longestShotText.textContent = `Longest shot of the round: ${scoresFromLongest[0].name} and ${scoresFromLongest[1].name} got a ${scoresFromLongest[0].score} at ${longestDistance}yrds` 
    }else {
        longestShotText.textContent = `Longest shot of the round: ${scoresFromLongest[0].name} got a ${scoresFromLongest[0].score} at ${longestDistance}yrds` 
    }
}

const isComebackKid = () => {
    const halfWayTotals = []
    players.forEach(player => {
        const halfWayScore = Object.values(player.scores).slice(0, halfWayPoint()).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        halfWayTotals.push({name: player.name, score: halfWayScore})
    })

    return halfWayTotals
}

const populateComebackKid = () => {
    const comebackKidText = document.querySelector('#comeback-kid p')
    const winner = playersInOrder[0]
    const orderedHalfWayTotals = [...isComebackKid()].sort((a, b) => b.score - a.score)
    const winnerInHalfWayTotals = [...isComebackKid()].filter(obj => obj.name === winner.name)
    const comebackKidDownBy = orderedHalfWayTotals[0].score - winnerInHalfWayTotals[0].score
    
    if (winner.name === isComebackKid().sort((a, b) => b.score - a.score)[0].name) {
        return 
    }else if (comebackKidDownBy > 15) {
        comebackKidText.textContent = `Comeback Kid: ${winner.name} was down by ${comebackKidDownBy} after ${halfWayPoint()} targets, then came back to win it all`
    }
}

endRound.addEventListener('click', () => {
    populatePodium()
    populateResultsTable()
    populateMosts()
    findsAndPopulatesLongestShot()
    populateComebackKid()
    inGame.setAttribute('hidden', '')
    roundSummary.removeAttribute('hidden')
})

/* 
    end round pop up style
 */