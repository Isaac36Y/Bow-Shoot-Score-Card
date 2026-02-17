/* New Round */
const newRound = document.querySelector('#new-round');
const table = document.querySelector('#new-round-table');
const addPlayerRow = document.querySelector('#add-player-row')


const confirmPlayerButton = document.querySelector('.confirm-player-button');
const deletePlayerButton = document.querySelector('.delete-player-button');
const editPlayerButton = document.querySelector('#edit-player-button');
const addPlayerButton = document.querySelector('#add-player-button');

const players = [
    /* {
        id: 1,
        name: "Isaac",
        scores: {
            1: "10",
            2: "8",
            3: "8",
            4: "0",
            5: "10"
        }
    } */
];

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
        <button type="button" class="confirm-player-button" onclick="savesPlayer(this)">&#x2713</button>
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
    <div class="new-round__table-row">
        <p class="id-cell"></p>
        <div class="name-cell"><input class="added-player__custom" type="text" name="name" placeholder="Name"></div>
        <div class="button-cell">
            <button type="button" class="delete-player-button" onclick="deletePlayer(this)"><img src="./images/delete.png" alt="trash can" width="20"></button>
            <button type="button" class="confirm-player-button" onclick="savesPlayer(this)">&#x2713</button>
        </div>
    </div>
    `

    addPlayerRow.insertAdjacentHTML('beforebegin', newPlayer)
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

const nextTargetButton = document.querySelector('#next-target-btn');
const previousTargetButton = document.querySelector('#previous-target-btn');
const scorecardButton = document.querySelector('#scorecard-btn')

const scorecard = document.querySelector('#scorecard');
const scorecardTotalColumn = document.querySelector('#scorecard-total');
const scorecardPlayerContainer = document.querySelector('#scorecard-player-container')


let target = 0;
const distances = {}


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
    })
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

/* controls scoring system */

/* create functions just initializes a new {target: score}. May be able to combine createScore and updateScore into one function. */
const createsScore = () => {
    players.forEach(player => {
        player.scores[target] = 0
    })
}

const createDistance = () => {
    distances[target] = 0
} 
/* update functions update the data inside the object every time a new value is given on that target to each score/distance */
const updateScore = (btn) => {
    const player = btn.closest('.in-game__target-score-row')
    const id = player.getAttribute('id').split("").slice(7, 8).join('')
    players[+id - 1].scores[+currentTarget.textContent] = +btn.value
}

const updateDistance = () => {
    distances[+currentTarget.textContent] = +distanceInput.value
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
    const scorecardPlayer = scorecardPlayerContainer.querySelector(`#${playerName.replace(' ', '-')}`)
    const scorecardPlayerCol = scorecardPlayer.querySelectorAll('.in-game__scorecard-number-player')
    scorecardPlayerCol.forEach(column => {
        const columnId = column.getAttribute('id').split("").slice(14, 15).join('')

        if (currentTarg === columnId) {
            column.textContent = btn.value
        }
    })
}

const updateTotalScorecardScores = () => {
    const totalRows = scorecardTotalColumn.querySelectorAll('.in-game__scorecard-number-total')
    
    totalRows.forEach(row => { 
        const rowName = row.getAttribute('id').split('').slice(0, -6).join('').replace('-', ' ')
        console.log(rowName)
        const playersData = players.filter(player => player.name === rowName)

        row.textContent = Object.values(playersData[0].scores).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    })

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
    /* const buttons = document.querySelectorAll('.in-game__target-score'); */
    if (items.length === indexOfSelected + 1) {
        addTarget()
        /* buttons.forEach(button => button.classList.remove('selected')) */
    }else {
        selectTarget(items[indexOfSelected + 1])
    }
}
/* try to make these into one function in the future */
const selectsPreviousTarget = () => {
    let items = Array.from(targetList.querySelectorAll('.in-game__target-select'))
    let indexOfSelected = items.findIndex(item => item.classList.contains('selected'))
    if (indexOfSelected === 0) {
        return 
    }else {
        selectTarget(items[indexOfSelected - 1])
    }
}


distanceInput.addEventListener('change', () => {
    updateDistance()
    updateDistanceToScorecard()

})

scoreSetterBox.addEventListener('click', (e) => {
    const button = e.target.closest('.in-game__target-score')
    if (!button) return
    updateScore(button)
    highlightSelectedScore(button)
    updatePlayerScoreToScorecard(button)
    updateTotalScorecardScores()

})

startRoundButton.addEventListener('click', () => {
    populateScoreSetterBox()
    addPlayerToScorecard()
    addTarget()
    
    newRound.setAttribute('hidden', '')
    inGame.removeAttribute('hidden')
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