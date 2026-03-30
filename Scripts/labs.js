
const openPracticeRadio = document.querySelector('#open-practice-radio');
const randomDistanceRadio = document.querySelector('#random-distance-practice-radio');
const distanceDialerRadio = document.querySelector('#distance-dialer-practice-radio');

const shotsAmountFieldset = document.querySelector('#practice-shots-amount-setting');
const distanceFieldset = document.querySelector('#practice-distance-setting');
const scoringSystemFieldset = document.querySelector('#practice-scoring-system-setting')

const shotsAmountOpenInput = document.querySelector('#shots-amount-open');
const shotsAmountCustomInput = document.querySelector('#shots-amount-custom');
const distanceOpenInput = document.querySelector('#distance-open');
const distanceCustomInput = document.querySelector('#distance-custom');

const toggleOpenPracticeDefaultSetting = () => {
    if (openPracticeRadio.checked) {
        shotsAmountOpenInput.checked = true
        distanceOpenInput.checked = true
        shotsAmountFieldset.style.opacity = "1"
        distanceFieldset.style.opacity = "1"
        scoringSystemFieldset.style.opacity = "1"
    }else {
        shotsAmountOpenInput.checked = false
        distanceOpenInput.checked = false
        shotsAmountFieldset.style.opacity = "0.1"
        distanceFieldset.style.opacity = "0.1"
        scoringSystemFieldset.style.opacity = "0.1"
    }
    
}

openPracticeRadio.addEventListener('click', toggleOpenPracticeDefaultSetting)