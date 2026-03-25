'use strict';

/* New Round */
const newRound = document.querySelector('#new-round');
const inGame = document.querySelector('#in-game');
const roundSummary = document.querySelector('#round-summary');


const table = document.querySelector('#new-round-table');
const addPlayerRow = document.querySelector('#add-player')
const addPlayerTable = document.querySelector('#add-player-table')


const confirmPlayerButton = document.querySelector('.confirm-player-button');
const deletePlayerButton = document.querySelector('.delete-player-button');
const editPlayerButton = document.querySelector('#edit-player-button');
const addPlayerButton = document.querySelector('#add-player-button');
const distanceMode = document.querySelector('#distance-mode-checkbox');
const confirmAllPlayersMsg = document.querySelector('#confirm-player-msg')

const storedStateString = localStorage.getItem('appState')

let state = {
    players: [],
    totalTargets: 0,
    selectedTarget: 0,
    screen: "newRound",
    multiplierOn: true
};

let playersInOrder;
let playersInOrderByMultiplied; 

const saveState = (save) => {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(save, serializedState)
}

const updatePlayerId = () => {
    state.players.forEach((player, index) => player.id = index + 1)
}

const setScreen = () => {
    if (state.screen === "newRound") {
        newRound.removeAttribute('hidden');
        inGame.setAttribute('hidden', '');
        roundSummary.setAttribute('hidden', '')
    }else if (state.screen === "inGame") {
        inGame.removeAttribute('hidden');
        newRound.setAttribute('hidden', '');
        roundSummary.setAttribute('hidden', '')
    }else if (state.screen === "roundSummary") {
        roundSummary.removeAttribute('hidden');
        newRound.setAttribute('hidden', '');
        inGame.setAttribute('hidden', '')
    }
}

const checksIfNameExist = (name) => {
    return state.players.every(player => player.name.trim() !== name.trim())
}

const savesPlayer = (el) => {
    const noNameMsg = document.querySelector('#no-name-msg');
    const nameAlreadyExists = document.querySelector('#same-name-msg')
    const row = el.closest('.new-round__table-row');
    const id = row.querySelector('.id-cell')
    const input = row.querySelector('.name-cell input')
    const name = input.value.trim();
    const buttons = row.querySelector('.button-cell');
    const nameCell = row.querySelector('.name-cell');

    if (state.players[+id.textContent - 1]) {
        nameCell.textContent = name
        buttons.innerHTML = '<button type="button" class="edit-player-button"><img src="./images/edit.png" alt="trash can" width="20"></button>'
    }else if (!checksIfNameExist(name)) {
        nameAlreadyExists.removeAttribute('hidden');
    }else if (name.length <= 0) {
        noNameMsg.removeAttribute('hidden');
    }else {
        nameAlreadyExists.setAttribute('hidden', '');
        noNameMsg.setAttribute('hidden', '');
        nameCell.textContent = name;
        state.multiplierOn
        ? state.players.push({ id: state.players.length + 1, name: name, targets: [], total: undefined, multipliedScores: {}, multipliedTotal: undefined})
        : state.players.push({ id: state.players.length + 1, name: name, targets: [], total: undefined});
        buttons.innerHTML = '<button type="button" class="edit-player-button"><img src="./images/edit.png" alt="trash can" width="20"></button>';
    }
    confirmAllPlayersMsg.setAttribute('hidden', '')
}

const editPlayer = (el) => {
    const row = el.closest('.new-round__table-row');
    const nameCell = row.querySelector('.name-cell');
    const name = nameCell.innerText;
    const buttons = row.querySelector('.button-cell');

    nameCell.innerHTML = `<input class="added-player__custom" type="text" name="name" placeholder="Name" value="${name}">`;
    buttons.innerHTML = `
        <button type="button" class="delete-player-button"><img src="./images/delete.png" alt="trash can" width="20"></button>
        <button type="button" class="confirm-player-button | prime-text">&#x2713</button>
        `
}

const updatePlayerNumber = () => {
    const addedPlayers = document.querySelectorAll('.new-round__table-row');
    addedPlayers.forEach((player, index) => {
        const id = player.querySelector('.id-cell');
        if (id) {
            id.textContent = index + 1
        }

    })
    updatePlayerId()
}

const addsPlayer = () => {
    const newPlayer = `
    <div class="new-round__table-row | dark-text">
        <p class="id-cell montserrat"></p>
        <div class="name-cell montserrat"><input class="added-player__custom" type="text" name="name" placeholder="Name"></div>
        <div class="button-cell">
            <button type="button" class="delete-player-button"><img src="./images/delete.png" alt="trash can" width="20"></button>
            <button type="button" class="confirm-player-button">&#x2713</button>
        </div>
    </div>
    `

    addPlayerTable.innerHTML += newPlayer
    updatePlayerNumber()
}

const deletePlayer = (el) => {
    const row = el.closest('.new-round__table-row');
    const id = row.querySelector('.id-cell').textContent;
    const indexToRemove = state.players.findIndex(player => player.id === +id);

    if (indexToRemove > -1) {
        state.players.splice(indexToRemove, 1) 
    }
    row.remove()
    updatePlayerNumber()
}

addPlayerButton.addEventListener('click', addsPlayer)

/* start round functions */


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
const confirmPopUp = document.querySelector('#end-confirm');
const confirmBackdrop = document.querySelector('.in-game__backdrop.end-game');
const firstEndRoundButton = document.querySelector('#end-round-btn')
const cancelEndRoundButton = document.querySelector('#confirm-msg-cancel')
const scorecardButton = document.querySelector('#scorecard-btn');

const scorecard = document.querySelector('#scorecard');
const scorecardNameColumn = document.querySelector('#scorecard-name-column')
const scorecardScoreContainer = document.querySelector('#scorecard-score-container')
const scorecardTotalColumn = document.querySelector('#scorecard-net');
const scorecardMultipliedColumn = document.querySelector('#scorecard-multiplied')
const scorecardPlayerContainer = document.querySelector('#scorecard-player-row')
const scorecardBackdrop = document.querySelector('.in-game__backdrop.scorecard');

let putsPlayersInOrder = () =>  playersInOrder = [...state.players].sort((a, b) => b.total - a.total);
let putsPlayersInOrderMultiplied = () => playersInOrderByMultiplied = [...state.players].sort((a, b) => b.multipliedTotal - a.multipliedTotal);

const populateScoreSetterBox = () => {
    state.players.forEach(player => {
        const playerEl = `
            <div class="in-game__target-score-row neutral-text" id="player-${player.id}" data-player-id="${player.id}">
                <div class="in-game__player-ids">
                    <p class="in-game__target-score-id montserrat">${player.id}</p>
                    <p class="in-game__target-score-player montserrat fw-700">${player.name}</p>
                </div>
                <div class="in-game__target-score-buttons">
                    <button type="button" class="in-game__target-score neutral-text montserrat" value="10">10</button>
                    <button type="button" class="in-game__target-score neutral-text montserrat" value="8">8</button>
                    <button type="button" class="in-game__target-score neutral-text montserrat" value="5">5</button>
                    <button type="button" class="in-game__target-score neutral-text montserrat" value="3">3</button>
                    <button type="button" class="in-game__target-score neutral-text montserrat" value="0">0</button>
                </div>
            </div>
        `
        scoreSetterBox.insertAdjacentHTML("beforeend", playerEl)
    })
}

const addPlayerToScorecard = () => {
    state.players.forEach(player => {
        const newName = String(player.name).split(/\s+/).join('-')

        const playerDiv = document.createElement('p');
        playerDiv.className = 'in-game__scorecard-name-player'
        playerDiv.id = newName;
        playerDiv.textContent = newName
        scorecardNameColumn.appendChild(playerDiv)

        const totalPar = document.createElement('p');
        totalPar.className = 'in-game__scorecard-number-total'
        totalPar.id = `${newName}-total`
        totalPar.textContent = '0'
        scorecardTotalColumn.appendChild(totalPar)

        if (state.multiplierOn) {
            const multiplierPar = document.createElement('p');
            multiplierPar.className = 'in-game__scorecard-multiplied-total'
            multiplierPar.id = `${newName}-multiplied`
            multiplierPar.textContent = '0'
            scorecardMultipliedColumn.appendChild(multiplierPar)
        }
    })
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

const handlesIfMultiplierMode = () => {
    const scorecarTotalsContainer = document.querySelector('.in-game__scorecard-total')


    if (!state.multiplierOn) {
        scorecardMultipliedColumn.style.display = 'none'
        scorecarTotalsContainer.style.gridTemplateColumns = '1fr'
        scorecarTotalsContainer.style.width = '20%'
        scorecardScoreContainer.style.width = '60%'
    }
}

/* expand target list */

const showTargetListToggle = () => {
    const arrowToggle = document.querySelector('#target-arrow-toggle')
    let open = targetsContainer.classList.contains('open');
    if (open) {
        targetsContainer.classList.remove('open');
        arrowToggle.src = "./images/arrow-down-3101_64.png"
        setTimeout(() => {
          targetsList.style.display = "none"  
        }, 500)
        
    }else {
        targetsContainer.classList.add('open')
        targetsList.style.display = "flex"
        arrowToggle.src = "./images/arrow-up.png"
    }
}

/* controls scoring system */

const updateDistance = () => {
    state.players.forEach(player => {
        player.targets[state.selectedTarget - 1].distance = +distanceInput.value
    })
}
/* update functions update the data inside the object every time a new value is given on that target to each score/distance */
const updateScore = (btn) => {
    const player = btn.closest('.in-game__target-score-row')
    const id = player.dataset.playerId
    const target = state.selectedTarget - 1
    state.players[+id - 1].targets[target].score = +btn.value


    if (state.multiplierOn) {
        const multipliedScore = (state.players[0].targets[target].distance < 20) ? +btn.value : +btn.value * (state.players[0].targets[target].distance * 0.05)

        state.players[+id - 1].multipliedScores[target] = +multipliedScore.toFixed(1)
    }

    updatePlayerScoreToScorecard(state.selectedTarget)
    updateTotalScorecardScores()
    
}

const highlightSelectedScore = (btn) => {
    const buttonsContainer = btn.closest('.in-game__target-score-buttons')
    const buttons = buttonsContainer.querySelectorAll('.in-game__target-score');
    buttons.forEach(button => {
        button.classList.remove('selected')
    })
    btn.classList.add('selected')
}
/* too long? should I break it up into smaller functions? */
const addColumnsToScorecard = (col) => {
    const targetRow = scorecard.querySelector('#scorecard-target-row');
    const distanceRow = scorecard.querySelector('#scorecard-distance-row');

    const targetCol = document.createElement('p');
    targetCol.className = 'in-game__scorecard-number-target';
    targetCol.textContent = `#${col}`;
    targetRow.appendChild(targetCol);
    
    const distanceCol = document.createElement('p');
    distanceCol.className = 'in-game__scorecard-number-distance';
    distanceCol.id = `distance-column-${col}`
    distanceRow.appendChild(distanceCol)

    const playerCol = document.createElement('div');
    playerCol.className = 'in-game__scorecard-number-score-container'
    playerCol.id = `player-column-${col}`
    scorecardPlayerContainer.appendChild(playerCol) 
    updatePlayerScoreToScorecard(col)
}

const updateDistanceToScorecard = () => {
        const scorecardPlayerCol = scorecard.querySelectorAll('.in-game__scorecard-number-distance')

        scorecardPlayerCol.forEach(column => {
            const columnId = column.getAttribute('id').replace('distance-column-', '').trim()

            column.textContent = state.players[0].targets[columnId - 1].distance ? `${state.players[0].targets[columnId - 1].distance}yrds` : ''
        })
}

const updatePlayerScoreToScorecard = (col) => {
    state.players.forEach((player, index) => {
        const playersName = player.name.split(' ').join('-')
        const playerCol = scorecardPlayerContainer.querySelector(`#player-column-${col}`)
        const playerRow = playerCol.querySelector(`#${playersName}`)
        const columnId = col - 1
        if (playerRow) {
            playerRow.textContent = state.players[index].targets[columnId].score
        }else {
            const playersScore = document.createElement('p');
            playersScore.className = 'in-game__scorecard-number-score'
            playersScore.id = player.name.split(' ').join('-')
            playersScore.textContent = state.players[index].targets[columnId].score
            playerCol.appendChild(playersScore)
        }
    })
}

const updateTotalScorecardScores = () => {
    const netTotalRows = scorecardTotalColumn.querySelectorAll('.in-game__scorecard-number-total');
    const multipliedTotalRows = scorecardMultipliedColumn.querySelectorAll('.in-game__scorecard-multiplied-total')
    /* TRY: add total from players data and use that to update each  */
    netTotalRows.forEach(row => { 
        const rowName = row.getAttribute('id').split('').slice(0, -6).join('').replace('-', ' ').trim()
        const player = state.players.filter(player => player.name === rowName)
        const totals = player[0].targets
        .map(target => target.score)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        
        row.textContent = totals
        player[0].total = totals
    })

    if (state.multiplierOn) {
        multipliedTotalRows.forEach(row => {
            const rowName = row.getAttribute('id').split('').slice(0, -11).join('').replace('-', ' ').trim();
            const playersData = state.players.filter(player => player.name === rowName)
            const multipliedTotal = +Object.values(playersData[0].multipliedScores).reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(1)
            
            row.textContent = multipliedTotal
            playersData[0].multipliedTotal = multipliedTotal
        })
    }
}

/* updateByTarget functions bring show the current score in the UI based off data from the objects. create/update/updateByTarget functions may be able to get combine in the
future but for now they work good alone and might work best alone. */
const updateDistanceByTarget = () => {
    if (state.players[0].targets[state.selectedTarget - 1].distance === null) {
        distanceInput.value = ''
    }else {
        distanceInput.value = state.players[0].targets[state.selectedTarget - 1].distance
    }
}

/* I am proud of this one */
const updateScoreByTarget = () => {
    const buttons = document.querySelectorAll('.in-game__target-score');
    state.players.forEach(player => {
        if (player.targets[state.selectedTarget - 1].score === null) {
            buttons.forEach(button => button.classList.remove('selected'))
            return
        }
        const playerRow = scoreSetterBox.querySelector(`#player-${player.id}`)
        const playersScoreButton = playerRow.querySelector(`[value="${player.targets[state.selectedTarget - 1].score}"]`)
        highlightSelectedScore(playersScoreButton)
    })
}

/* add/changes targets */

const selectTarget = (el) => {
    let items = targetList.querySelectorAll('.in-game__target-select');
    console.log(state)
    if (state.selectedTarget > 0 && state.multiplierOn && state.players[0].targets[state.selectedTarget - 1].distance === null) {
        noDistanceError(true)
        return
    }

    items.forEach(item => item.classList.remove('selected'));

    state.selectedTarget = +el.textContent
    el.classList.add('selected');
    currentTarget.textContent = state.selectedTarget

    updateScoreByTarget()
    updateDistanceByTarget()
}

const addTarget = () => {
    state.totalTargets++
    currentTarget.textContent = state.totalTargets;

    const li = document.createElement('li');
    li.className = 'in-game__target-select';
    li.textContent = state.totalTargets;
    targetList.appendChild(li)
    state.players.forEach(player => {
        player.targets.push({target: state.totalTargets, score: null, distance: null})
    })
    selectTarget(li)
    addColumnsToScorecard(state.totalTargets)
}

const selectsNextTarget = () => {
    let items = Array.from(targetList.querySelectorAll('.in-game__target-select'))
    let indexOfSelected = items.findIndex(item => item.classList.contains('selected'))
    
    if (state.multiplierOn && state.players[0].targets[state.selectedTarget - 1].distance === null) {
        noDistanceError(true)
        return
    }

    if (items.length === indexOfSelected + 1) {
        addTarget()
    }else {
        selectTarget(items[indexOfSelected + 1])
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
    }else if (state.multiplierOn && state.players[0].targets[state.selectedTarget - 1].distance === null) {
            noDistanceError(true)
            return
    }else {
        selectTarget(items[indexOfSelected - 1])
        updateScoreByTarget()
        updateDistanceByTarget()
    }
}

/* popup toggles */

const togglesEndRoundPopUp = () => {
    if (confirmPopUp.style.display === 'flex') {
        confirmPopUp.style.display = 'none'
        confirmBackdrop.setAttribute('hidden', '')
    }else {
        confirmPopUp.style.display = 'flex';
        confirmBackdrop.removeAttribute('hidden')
    }
}

const toggleScorecard = () => {
    const open = scorecard.hasAttribute('open');
    if (!open) {
        scorecard.setAttribute('open', '')
        scorecardBackdrop.removeAttribute('hidden')
    }else {
        scorecard.removeAttribute('open')
        scorecardBackdrop.setAttribute('hidden', '')
    }
}

const noDistanceError = (error) => {
    error ? distanceErroeMessage.style.display = 'block' : distanceErroeMessage.style.display = 'none'
}

/* in game event listeners */

distanceInput.addEventListener('change', () => {
    const selectedButtons = scoreSetterBox.querySelectorAll('.in-game__target-score.selected')
    updateDistance()
    updateDistanceToScorecard()
    putsPlayersInOrderMultiplied()
    selectedButtons.forEach(button => {
        updateScore(button)
    })
    updateTotalScorecardScores()
    noDistanceError(false)
    saveState('appState')
})

scoreSetterBox.addEventListener('click', (e) => {
    const button = e.target.closest('.in-game__target-score')
    if (!button) return
    updateScore(button)
    highlightSelectedScore(button)
    putsPlayersInOrder()
    putsPlayersInOrderMultiplied()
    
    saveState('appState')
})

table.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-player-button')
    const confirmBtn = e.target.closest('.confirm-player-button')
    const editBtn = e.target.closest('.edit-player-button')

    if (!deleteBtn && !confirmBtn && !editBtn) return


    if (deleteBtn) {
        deletePlayer(deleteBtn)
    }else if (confirmBtn) {
        savesPlayer(confirmBtn)
    }else if (editBtn) {
        editPlayer(editBtn)
    }
})

startRoundButton.addEventListener('click', () => {
    state.screen = "inGame"
    const childrenOfAddPlayerTable = addPlayerTable.children;

    distanceMode.checked ? state.multiplierOn = true : state.multiplierOn = false
    if (childrenOfAddPlayerTable.length !== state.players.length) {
        confirmAllPlayersMsg.removeAttribute('hidden');
    }else if (state.players.length === 0) {
        return
    }else {
        setScreen()
        handlesIfMultiplierMode()
        populateScoreSetterBox()
        addPlayerToScorecard()
        addTarget() 
        adjustsGapOfScoreBox(childrenOfAddPlayerTable.length)
    }
})

targetList.addEventListener('click', (e) => {
    const li = e.target.closest('.in-game__target-select')
    if (!li || !targetList.contains(li)) return
    selectTarget(li)
})

targetExpandButton.addEventListener('click', showTargetListToggle)

scorecardButton.addEventListener('click', toggleScorecard)

scorecardBackdrop.addEventListener('click', toggleScorecard)

firstEndRoundButton.addEventListener('click', togglesEndRoundPopUp)

cancelEndRoundButton.addEventListener('click', togglesEndRoundPopUp)

/* saved game check */

window.addEventListener('load', () => {
   if (storedStateString) {
    try {
        state = JSON.parse(storedStateString)
        const childrenOfAddPlayerTable = addPlayerTable.children;
        setScreen()
        addPlayerToScorecard()
        for (let i = 1; i <= state.totalTargets; i++) {
            const li = document.createElement('li')
            li.className = 'in-game__target-select';
            li.textContent = i;
            targetList.appendChild(li)
            
            addColumnsToScorecard(i)
            updateDistanceToScorecard()
            updatePlayerScoreToScorecard(i)
        }
        handlesIfMultiplierMode()
        populateScoreSetterBox()
        selectTarget(targetList.lastChild)
        adjustsGapOfScoreBox(childrenOfAddPlayerTable.length)
        updateTotalScorecardScores()
        putsPlayersInOrder()
        putsPlayersInOrderMultiplied()
        } catch (e) {
            console.log('error parsing stored state', e)
        }
    }else {
        state = {
        players: [],
        totalTargets: 0,
        selectedTarget: 0,
        distances: {},
        screen: "newRound",
        multiplierOn: true
    }
    } 
}) 

/* Round Summary */

const endRound = document.querySelector('#confirm-msg-confirm');
const resultsStyleContainer = document.querySelector('#results-style');
const showNetResults = document.querySelector('#show-net-results');
const showMultipliedResults = document.querySelector('#show-multiplied-results');

const saveRound = document.querySelector('#save-round');
const deleteRound = document.querySelector('#delete-round');
const saveRoundConfirm = document.querySelector('#save-round-confirm');
const deleteRoundConfirm = document.querySelector('#delete-round-confirm');
const saveRoundCancel = document.querySelector('#save-round-cancel');
const deleteRoundCancel = document.querySelector('#delete-round-cancel');
const roundNameInput = document.querySelector('#round-name')

const halfWayPoint = () => {
    const totalAmountOfTargets = Object.keys(state.players[0].targets).length
    return Math.floor(totalAmountOfTargets / 2)
}

const findsMosts = (num) => {
    const playersNums = []
    state.players.forEach(player => {
        let tensCount = 0
        player.targets.map(target => {
            if (target.score === num) {
                tensCount++
            }
        })
        playersNums.push({name: player.name, amount: tensCount})
    })

    playersNums.sort((a, b) => b.amount - a.amount)[0]
    return playersNums.filter(player => player.amount === playersNums[0].amount)
}

const isComebackKid = () => {
    const halfWayTotals = []
    state.players.forEach(player => {
        const halfWayScore = player.targets.map(target => target.score).slice(0, halfWayPoint()).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        halfWayTotals.push({name: player.name, score: halfWayScore})
    })

    return halfWayTotals
}

const populatePodium = (order) => {
    const podium1 = document.querySelector('#podium-1 p');
    const podium2 = document.querySelector('#podium-2 p');
    const podium3 = document.querySelector('#podium-3 p');
    let spliceLength
    
    (order.length < 3) ? spliceLength = order.length : spliceLength = 3

    const topThree = [...order].splice(0, spliceLength);

    podium1.textContent = topThree[0].name;
    if (spliceLength === 2) {
        podium2.textContent = topThree[1].name;
    }else if (spliceLength == 3) {
        podium2.textContent = topThree[1].name;
        podium3.textContent = topThree[2].name;
    }
}

const isPlayersScorecardEl = (player) => {
    let el = ``
    player.targets.forEach(target => {
        if (target.score !== null) {
           el += `<div>
                        <p class="round-summary__details-round-scorecard-target">#${target.target}</p>
                        <p class="round-summary__details-round-scorecar-score fw-700">${target.score}</p>
                    </div>` 
        }
    })
    return el
}

const isPlayerScoreBreakdownEl = (player) => {
    const firstPlayer = scoreSetterBox.querySelector('#player-1')
    const scoreEl = firstPlayer.querySelectorAll('.in-game__target-score');

    let scoreValues = []
    scoreEl.forEach(el => scoreValues.push(el.getAttribute('value')))

    let el = ''
    scoreValues.forEach(value => {
        const amount = player.targets.filter(target => target.score === +value)
        el += `<p class="round-summary__details-score-breakdown-score">${value}s: <span class="fw-700">${amount.length}</span></p>`
    })
    return el
}


const populateResultsTable = (order) => {
    const resultsTable = document.querySelector('#results-table');

    resultsTable.innerHTML = ''
    order.forEach(player => {
        const amountOfDivs = document.querySelectorAll('.round-summary__results-row').length
        const total = order === playersInOrderByMultiplied ? player.multipliedTotal : player.total
    
        let place
        if (amountOfDivs === 0) {
            place = '1st'
        }else if (amountOfDivs === 1) {
            place = '2nd'
        }else if (amountOfDivs === 2) {
            place = '3rd'
        }else place = `${amountOfDivs + 1}th`
        
        resultsTable.innerHTML += `
        <details class="round-summary__details  montserrat ">
            <summary class="round-summary__details-summary neutral-text">
                <p class="round-summary__results-marker">&#9658;</p>
                <p class="round-summary__results-place">${place}</p>
                <p class="round-summary__results-name">${player.name}</p>
                <p class="round-summary__results-score">${total}</p>
            </summary>
            <div>
                <div class="round-summary__details-score-breakdown dark-text montserrat">
                    ${isPlayerScoreBreakdownEl(player)}
                </div>
                <div class="round-summary__details-round-scorecard dark-text montsrrat">
                    ${isPlayersScorecardEl(player)}
                </div>
            </div>
        </details>
        ` 
    })
}

const populateMosts = () => {
    const mostTens = document.querySelector('#most-tens p')
    const mostZeros = document.querySelector('#most-zeros p')
    if (state.players.length === 1) {
        mostTens.textContent = findsMosts(10)[0].amount === 0 ? "You didn't get any tens" : `You got ${findsMosts(10)[0].amount} ${findsMosts(10)[0].amount <= 1 ? "10" : "10s"}. Nice Job!`
        mostZeros.textContent = findsMosts(0)[0].amount === 0 ? "You didn't get a single 0! Well done" : `You got ${findsMosts(0)[0].amount} ${findsMosts(10)[0].amount <= 1 ? "0" : "0s"}.`
    }else {
        mostTens.innerHTML = findsMosts(10)[0].amount === 0 ? "Most 10s in the round: Nobody. Everyone go home and practice" : `<span class="fw-700">Most 10s in the round:</span> ${findsMosts(10).map(player => player.name).join(", ")} with ${findsMosts(10)[0].amount}.`
        mostZeros.innerHTML = findsMosts(0)[0].amount === 0 ? "Most 0s in the round: Nobody! Nice shooting everyone" : `<span class="fw-700">Most 0s in the round:</span> ${findsMosts(0).map(player => player.name).join(", ")} with ${findsMosts(0)[0].amount}.`
    }
}

const findsAndPopulatesLongestShot = () => {
    /* this can be made much more simple */
    const longestShotText = document.querySelector('#longest-shot p')
    const longestDistance = Math.max(...state.players[0].targets.map(target => target.distance))
    const longestTarget = state.players[0].targets.findIndex(target => target.distance === longestDistance)
    const scoresFromLongest = []

    if (longestDistance < 20) return 
    /* pulls all scores on the longest target */
    state.players.forEach(player => {
        scoresFromLongest.push({name: player.name, score: player.targets[longestTarget].score})
    })
    /* sorts scores from highest to lowest, then checks if there are multiple people with the highest score on the longest target */
    scoresFromLongest.sort((a, b) => b.score - a.score)
    const highestScore = scoresFromLongest[0].score
    const ifTie = scoresFromLongest.filter(each => each.score === highestScore)
    if (state.players.length === 1) {
        longestShotText.textContent = `Your longest shot of the day was ${longestDistance}yrds and you scored a ${highestScore}.`
    }else if (ifTie.length > 1) {
        longestShotText.innerHTML = `<span class="fw-700">Longest shot of the round:</span> ${ifTie.map(player => player.name).join(", ")} got a ${highestScore} at ${longestDistance}yrds.` 
    }else {
        longestShotText.innerHTML = `<span class="fw-700">Longest shot of the round:</span> ${scoresFromLongest[0].name} got a ${highestScore} at ${longestDistance}yrds.` 
    } 
}

const populateComebackKid = () => {
    const comebackKidText = document.querySelector('#comeback-kid p')
    const winner = playersInOrder[0]
    const orderedHalfWayTotals = [...isComebackKid()].sort((a, b) => b.score - a.score)
    const winnerInHalfWayTotals = [...isComebackKid()].filter(obj => obj.name === winner.name)
    const comebackKidDownBy = orderedHalfWayTotals[0].score - winnerInHalfWayTotals[0].score
    
    if (winner.name === isComebackKid().sort((a, b) => b.score - a.score)[0].name) {
        return 
    }else if (comebackKidDownBy > 10) {
        comebackKidText.innerHTML = `<span class="fw-700">Comeback Kid:</span> ${winner.name} was down by ${comebackKidDownBy} points after ${halfWayPoint()} targets, then came back to win it all.`
    }
}

const saveOrDeletePopUp = (opt) => {
    const savePopUp = document.querySelector('#confirm-save-round')
    const deletePopUp = document.querySelector('#confirm-delete-round')
    const roundSummaryBackdrop = document.querySelector('.round-summary__backdrop');

    if (opt === 'save') {
        savePopUp.style.display = 'flex'
        roundSummaryBackdrop.removeAttribute('hidden')
        window.scrollTo(0, 0)
        document.body.style.overflow = 'hidden'
    }else if (opt === 'delete') {
        deletePopUp.style.display = 'flex'
        roundSummaryBackdrop.removeAttribute('hidden')
        window.scrollTo(0, 0)
        document.body.style.overflow = 'hidden'
    }else if (opt === 'close') {
        savePopUp.style.display = 'none';
        deletePopUp.style.display = 'none';
        roundSummaryBackdrop.setAttribute('hidden', '')
        document.body.style.overflow = 'auto'
    }
}

endRound.addEventListener('click', () => {
    state.screen = "roundSummary"
    setScreen()
    populatePodium(playersInOrder)
    populateResultsTable(playersInOrder)
    populateMosts()
    findsAndPopulatesLongestShot()
    populateComebackKid()

    if (!state.multiplierOn) {
        resultsStyleContainer.style.display = "none"
    }
})

showMultipliedResults.addEventListener('click', () => {
    populatePodium(playersInOrderByMultiplied);
    populateResultsTable(playersInOrderByMultiplied)
    showMultipliedResults.style.backgroundColor = 'var(--color-neautral-dark)';
    showMultipliedResults.style.color = 'var(--color-neutral)';
    showNetResults.style.backgroundColor = 'transparent';
    showNetResults.style.color = 'var(--color-neautral-dark)'
})

showNetResults.addEventListener('click', () => {
    populatePodium(playersInOrder);
    populateResultsTable(playersInOrder)
    showMultipliedResults.style.backgroundColor = 'transparent';
    showMultipliedResults.style.color = 'var(--color-neautral-dark)';
    showNetResults.style.backgroundColor = 'var(--color-neautral-dark)';
    showNetResults.style.color = 'var(--color-neutral)'
})

saveRound.addEventListener('click', () => {
    saveOrDeletePopUp('save')
})

deleteRound.addEventListener('click', () => {
    saveOrDeletePopUp('delete')
})

saveRoundCancel.addEventListener('click', () => {
    saveOrDeletePopUp('close')
})

deleteRoundCancel.addEventListener('click', () => {
    saveOrDeletePopUp('close')
})

saveRoundConfirm.addEventListener('click', () => {
    const roundName = roundNameInput.value.trim()
    if (roundName.length > 1) {
        saveState(`${roundName}, ${(new Date).toDateString()}`)
        localStorage.removeItem('appState');
        location.reload()
    }
    
})

deleteRoundConfirm.addEventListener('click', () => {
    localStorage.removeItem('appState');
    location.reload()
})




