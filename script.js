/* New Round */

const table = document.querySelector('#new-round-table');
const addPlayerRow = document.querySelector('.add-player')



const confirmPlayerButton = document.querySelector('.confirm-player-button');
const deletePlayerButton = document.querySelector('.delete-player-button');
const editPlayerButton = document.querySelector('#edit-player-button');
const addPlayerButton = document.querySelector('#add-player-button');

const players = [];

const addsPlayerOption = () => {
    const newPlayer = `
    <tr class="added-player">
        <td class="id"></td>
        <td class="name-cell"><input class="added-player__custom" type="text" name="name" placeholder="Name"></td>
        <td class="buttons">
            <button type="button" class="delete-player-button"><img src="./images/delete.png" alt="trash can" width="20"></button>
            <button type="button" class="confirm-player-button" onclick="savePlayer(this)">&#x2713</button>
        </td>
    </tr>
    `

    addPlayerRow.insertAdjacentHTML('beforebegin', newPlayer)
    updatePlayerNumber()
}

    
    
const updatePlayerNumber = () => {
    const addedPlayers = document.querySelectorAll('.added-player');
    addedPlayers.forEach((player, index) => {
        id = player.querySelector('.id');
        id.textContent = index + 1

    })
}

/* const changeButtons = (state) => {

    const  buttons = document.querySelector('.buttons');

    if (state === "save") {
        buttons.innerHTML = '<button type="button" id="edit-player-button"><img src="./images/edit.png" alt="trash can" width="20"></button>'
    }else if (state === "edit") {
        buttons.innerHTML = `
        <button type="button" class="delete-player-button"><img src="./images/delete.png" alt="trash can" width="20"></button>
        <button type="button" class="confirm-player-button" onclick="savePlayer(this)">&#x2713</button>
        `
    }
} */

const savePlayer = (el) => {
    const row = el.closest('tr');
    const id = row.querySelector('.id')
    const input = row.querySelector('.name-cell input')
    const name = input.value.trim();
    const buttons = row.querySelector('.buttons')

    const nameCell = row.querySelector('.name-cell');
    if (name.length > 0) {
        nameCell.textContent = name
        /* changeButtons("save") */
        players.push({ id: +id.textContent, name: name})
        buttons.innerHTML = '<button type="button" id="edit-player-button" onclick="editPlayer(this)"><img src="./images/edit.png" alt="trash can" width="20"></button>'
    }else {
        console.log('no name')
    }
}

const editPlayer = (el) => {
    const row = el.closest('tr');
    const nameCell = row.querySelector('.name-cell');
    const name = nameCell.innerText
    const buttons = row.querySelector('.buttons')

    nameCell.innerHTML = `<input class="added-player__custom" type="text" name="name" placeholder="Name" value="${name}">`;
    buttons.innerHTML = `
        <button type="button" class="delete-player-button" onclick="deletePlayer(this)"><img src="./images/delete.png" alt="trash can" width="20"></button>
        <button type="button" class="confirm-player-button" onclick="savePlayer(this)">&#x2713</button>
        `
}

const deletePlayer = (el) => {
    const row = el.closest('tr')
    row.remove()
}


addPlayerButton.addEventListener('click', () => {
    addsPlayerOption()
    console.log(players)
})