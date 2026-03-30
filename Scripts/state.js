export let state = {
    players: [],
    totalTargets: 0,
    selectedTarget: 0,
    screen: "newRound",
    multiplierOn: true
};

export const setState = (newState) => {
    Object.assign(state, newState) 
}

export const saveState = (save) => {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(save, serializedState)
}