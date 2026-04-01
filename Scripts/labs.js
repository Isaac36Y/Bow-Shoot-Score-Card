
const openPracticeRadio = document.querySelector('#open-practice-radio');
const randomDistanceRadio = document.querySelector('#random-distance-practice-radio');
const distanceDialerRadio = document.querySelector('#distance-dialer-practice-radio');

const settingContainer = document.querySelector('#practice-setting')
const shotsAmountFieldset = document.querySelector('#practice-shots-amount-setting');
const distanceFieldset = document.querySelector('#practice-distance-setting');
const scoringSystemFieldset = document.querySelector('#practice-scoring-system-setting')

const shotsAmountOpenInput = document.querySelector('#shots-amount-open');
const shotsAmountCustomInput = document.querySelector('#shots-amount-custom');
const distanceOpenInput = document.querySelector('#distance-open');
const distanceRandomInput = document.querySelector('#distance-random')
const distanceCustomInput = document.querySelector('#distance-custom');

const toggleOpenPracticeDefaultSetting = () => {
        ablesInputs()
        if (shotsAmountCustomInput.value) shotsAmountCustomInput.value = ''
        shotsAmountOpenInput.checked = true
        distanceOpenInput.checked = true
        settingContainer.style.opacity = "1"
        distanceCustomInput.style.opacity = "1"
        distanceOpenInput.style.opacity = "1"
        distanceRandomInput.style.opacity = "1"
        
        
}

const toggleRandomPracticeDefaultSetting = () => {
        ablesInputs()
        if (!shotsAmountCustomInput.value) shotsAmountOpenInput.checked = true
        distanceRandomInput.checked = true
        distanceCustomInput.value = ''
        distanceRandomInput.style.opacity = "1"
        distanceOpenInput.style.opacity = "0.1"
        distanceOpenInput.setAttribute('disabled', '')
        distanceCustomInput.style.opacity = "0.1"
        distanceCustomInput.setAttribute('disabled', '')

        settingContainer.style.opacity = "1"
}

const toggleDistanceDialerDefaultSetting = () => {
    ablesInputs()
    if (!shotsAmountCustomInput.value) shotsAmountOpenInput.checked = true
    distanceRandomInput.checked = false
    distanceOpenInput.checked = false
    distanceCustomInput.style.opacity = "1"
    distanceOpenInput.style.opacity = "0.1"
    distanceOpenInput.setAttribute('disabled', '')
    distanceRandomInput.style.opacity = "0.1"
    distanceRandomInput.setAttribute('disabled', '')
    distanceCustomInput.value = '30'
    settingContainer.style.opacity = "1"

}

const ablesInputs = () => {
    const inputs = settingContainer.querySelectorAll('input')

    inputs.forEach(input => input.removeAttribute('disabled'));
}

const limitsToTwoDigits = () => {
    if (distanceCustomInput.value.length > 2) {
        distanceCustomInput.value = distanceCustomInput.value.slice(0, 2)
    }
}

const preventsTextAndRadio = (el) => {
    const setting = el.closest('fieldset')
    const custom = setting.querySelector('input[type="number"]')
    const radios = setting.querySelectorAll('input[type="radio"]')

    el.type === 'radio' ? custom.value = '' : radios.forEach(radio => radio.checked = false)
}

openPracticeRadio.addEventListener('click', toggleOpenPracticeDefaultSetting)
randomDistanceRadio.addEventListener('click', toggleRandomPracticeDefaultSetting)
distanceDialerRadio.addEventListener('click', toggleDistanceDialerDefaultSetting)
distanceCustomInput.addEventListener('input', limitsToTwoDigits)

settingContainer.addEventListener('input', (e) => {
    const input = e.target.closest('input')
    if (!input) return 
    preventsTextAndRadio(input)
})