/* New Round */

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
    if (name.length > 0) {
        nameCell.textContent = name
        players.push({ id: +id.textContent, name: name})
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