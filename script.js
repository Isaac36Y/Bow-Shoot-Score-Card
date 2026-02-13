/* New Round */
const newRound = document.querySelector('#new-round');
const table = document.querySelector('#new-round-table');
const addPlayerRow = document.querySelector('#add-player-row')



const confirmPlayerButton = document.querySelector('.confirm-player-button');
const deletePlayerButton = document.querySelector('.delete-player-button');
const editPlayerButton = document.querySelector('#edit-player-button');
const addPlayerButton = document.querySelector('#add-player-button');

const players = [];


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
    console.log(players)
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


addPlayerButton.addEventListener('click', () => {
    addsPlayer()
    
})

/* start round functions */

const inGame = document.querySelector('#in-game')
const startRoundButton = document.querySelector('#start-round-btn');
const scoreSetterBox = document.querySelector('#score-setter-container');
const targetList = document.querySelector('#target-list');
const targetListItems = document.querySelectorAll('.in-game__target-select');
const currentTarget = document.querySelector('#target-number-span');
const nextTargetButton = document.querySelector('#next-target-btn');
const previousTargetButton = document.querySelector('#previous-target-btn');


let targets = 0;

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

/* add/changes targets */

const addTarget = () => {
    targets++
    currentTarget.textContent = targets;
    const li = document.createElement('li');
    li.className = 'in-game__target-select';
    li.textContent = targets;
    targetList.appendChild(li)
    selectTarget(li)
    createsScore()
}

const selectTarget = (el) => {
    let items = targetList.querySelectorAll('.in-game__target-select');
    items.forEach(item => item.classList.remove('selected'))
    el.classList.add('selected');
    currentTarget.textContent = el.textContent
    updateScoreByTarget(el)
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

/* controls scoring system */

/* createScore just initializes a new {target: score}. May be able to combine createScore and updateScore into one function */
const createsScore = () => {
    players.forEach(player => {
        player.scores[targets] = 0
    })
}
/* updateScoreByTarget is important to pull the data and show it if a player needs to go back to a previous target to change the score */
const updateScoreByTarget = (el) => {
    const target = +el.textContent
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

const updateScore = (btn) => {
    const player = btn.closest('.in-game__target-score-row')
    const id = player.getAttribute('id').split("").slice(7, 8).join('')
    players[+id - 1].scores[+currentTarget.textContent] = btn.value
}

const highlightSelectedScore = (btn) => {
    const buttonsContainer = btn.closest('.in-game__target-score-buttons')
    const buttons = buttonsContainer.querySelectorAll('.in-game__target-score');
    buttons.forEach(button => {
        button.classList.remove('selected')
    })
    btn.classList.add('selected')
}

/* players for each in select target to find if the player has a value for that specific target */

scoreSetterBox.addEventListener('click', (e) => {
    const button = e.target.closest('.in-game__target-score')
    if (!button) return
    updateScore(button)
    highlightSelectedScore(button)
    console.log(players)
})

startRoundButton.addEventListener('click', () => {
    populateScoreSetterBox()
    addTarget()
    newRound.setAttribute('hidden', '')
    inGame.removeAttribute('hidden')
})

targetList.addEventListener('click', (e) => {
    const li = e.target.closest('.in-game__target-select')
    if (!li || !targetList.contains(li)) return
    selectTarget(li)
})

/* expand target list */

const targetExpandButton = document.querySelector('#target-expand-btn');
const targetsContainer = document.querySelector('.in-game__target-container')
const targetsList = document.querySelector('.in-game__target-select-ol')

targetExpandButton.addEventListener('click', () => {
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
})