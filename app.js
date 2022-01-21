const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const clearCompleteWordsButton = document.querySelector('[data-clear-complete-words-button]')

const listsDisplayContainer = document.querySelector('[data-lists-display-container]')
const listTitle = document.querySelector('[data-list-title]')
const listCount = document.querySelector('[data-list-count]')
const wordsContainer = document.querySelector('[data-words]')
const newWordForm = document.querySelector('[data-new-word-form]')
const newWordInput = document.querySelector('[data-new-word-input]')

const randomWord = document.querySelector('[random-word]')
const randomWordButton = document.querySelector('[random-word-button]')
const team1Button = document.querySelector('[team-1-button]')
const team2Button = document.querySelector('[team-2-button]')

const categoryNames = document.querySelector('[category-names]')
const team1Score = document.getElementById('team1-score')
const team2Score = document.getElementById('team2-score')
const activeCategorySelection = document.querySelector('.active-category-selection')

const redWinner = document.getElementById('red-winner')
const blueWinner = document.getElementById('blue-winner')
const categorySelection = document.querySelector('.category-selection')

const showButton = document.getElementById('show-button')
const hiddenCategoryAdded = document.querySelector('.lists')
const wordTemplate = document.getElementById('word-template')

const countdown = document.getElementById('countdown')
const timeoutSound = document.getElementById('timeout-sound')
const scoreboard = document.querySelector('.scoreboard')

const selectionButton = document.getElementById('selection-button')


// the data attribute is used to store custom data private to a page
// to make a data attribute it must start with 'data-'
// need key-value pairs to store locally
// need to make namespace when storing locally, hence 'word.' added bc
// it prevents you from over-riding info already in local stroage or 
// other websites from overriding my local storage keys
const local_storage_list_key = 'word.lists'
const local_storage_list_id_key = 'word.selectedListId'

// get information from local storage using this key and if it exists parse it into
// an object or if it does not exist give an empty array of lists to start
let lists = JSON.parse(localStorage.getItem(local_storage_list_key)) || []
let selectedListId = localStorage.getItem(local_storage_list_id_key)

hiddenCategoryAdded.style.display = 'none'
function hideWordAdder(){
   
    if(hiddenCategoryAdded.style.display === 'none') {
        hiddenCategoryAdded.style.display = 'flex'
    }
    else {
        
        hiddenCategoryAdded.style.display = 'none'
    }
    if(hiddenCategoryAdded.style.display === 'none') {
        showButton.innerHTML = 'add words'
    }
    if(hiddenCategoryAdded.style.display === 'flex') {
        showButton.innerHTML = 'hide'
    }
}

function renderLists() {
    // for each list inside of lists create a li element with the right class added
    // list.name so that the list will be identifible by the entered name
    // listsContainer.appendChild(listElement) actually adds the item to the list
    // listElement.dataset.listId = list.id adds data attribute so that its possible to know which list is being selected
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        
        listElement.innerText = list.name
        // if list is currently selected list set it to active list
        if (list.id === selectedListId) {
            listElement.classList.add("active-list")
        }
        listsContainer.appendChild(listElement)
    })
}

function renderCategories() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        //listElement.classList.add("list-names")
        listElement.classList.add("category-selection")
        listElement.classList.add("list-name")
         listElement.innerText = list.name
       
        // listElement.style.display = "none"
        // if list is currently selected list set it to active list
        if (list.id === selectedListId) {
            listElement.classList.add("active-category-selection")
            listElement.style.display = ""
        }

        categoryNames.appendChild(listElement)
    })  
}
   
listsContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId

        saveAndRender()
    }
}) 

categoryNames.addEventListener('click', e => {

    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId

        saveAndRender()
    }
})  

wordsContainer.addEventListener('click', e => {

    // if checkbox has been marked(input)
    if(e.target.tagName.toLowerCase() === 'input') { 
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedword = selectedList.words.find(word => word.id === e.target.id)
        selectedword.complete = e.target.checked
        
        save()
        wordCount(selectedList)
    }
})

deleteListButton.addEventListener('click', e => {
    // finds which has selectedListId and deletes it, value set to null bc its not longer the selected list
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

clearCompleteWordsButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    // set word list to all words which have not been completed
    selectedList.words = selectedList.words.filter(word => !word.complete)
    saveAndRender()
})
newListForm.addEventListener('submit', e => {
    //stops page from refreshing when enter is pressed in new list name box
    e.preventDefault();
    // .value must be added to get the string value that was typed in 
    const listName = newListInput.value
    if (listName == null || listName === '') return
    // if name is typed in create a new list
    const list = createList(listName)
    // clears list name from list adder bar once its successfully added
    newListInput.value = null
    // takes lists variable (all lists) and adds the new list to it
    lists.push(list)

    saveAndRender()
})

newWordForm.addEventListener('submit', e => {
    e.preventDefault();
    const wordName = newWordInput.value
    if (wordName == null || wordName === '') return
    const word = createword(wordName)
    
    newWordInput.value = null

    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.words.push(word)

    saveAndRender()
}) 

function createList(name) {
    // returns object, Date.now().toString() take the date and current tinme and convert them to a string to 
    // give a unique identifier, name is set to the name and each list will have a set of words
    return {id: Date.now().toString(), name: name, words:[] } 
}

function createword(name) {
    return {id: Date.now().toString(), name: name, complete: false } 
}

function saveAndRender() {
    save()
    render()
}

function save() {
   localStorage.setItem(local_storage_list_key, JSON.stringify(lists)) 
   
   localStorage.setItem(local_storage_list_id_key, selectedListId)
}

function render() {
    // bc it clears and then re-renders everything i dont have to manually remove the class of active list 
    // from the selected and then unselected lists
    clearElement(listsContainer)
    clearElement(categoryNames)
    
    renderLists()
    renderCategories()
    const selectedList = lists.find(list => list.id === selectedListId)
    // if no list is selcted word section will disappear
    // else word section will be shown '' reverts it to normal
    if(selectedListId == null) {
        listsDisplayContainer.style.display = 'none'

    } else {
        listsDisplayContainer.style.display = ''
        // sets title of word area to whatever list is selected
        listTitle.innerText = selectedList.name
        wordCount(selectedList)
        clearElement(wordsContainer)
        renderwords(selectedList)
    }
}

function clearElement(element) {
    // makes sure everything in list is deleted everytime that render is called
    // hard coded list names will not show up, only ones entered by user 
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function renderwords(selectedList) {
    //runs for every word 
    selectedList.words.forEach(word => {
        // renders everything in template when true is added, without true would just add top most 
        // div information
        const wordElement = document.importNode(wordTemplate.content, true)

        const checkbox = wordElement.querySelector('input')
        checkbox.id = word.id
        checkbox.checked = word.complete

        const label = wordElement.querySelector('label')
        label.htmlFor = word.id
        label.append(word.name)
        wordsContainer.appendChild(wordElement)
    })
}

function wordCount(selectedList) {
    // get every word that is not complete
    const numberOfWords = selectedList.words.filter(word => !word.complete).length


    // if just one word 'word' will be singular, else it will be 'words'
    const wordString = numberOfWords === 1 ? "word" : "words"
    listCount.innerText = `${numberOfWords} ${wordString}`
}

function random(selectedList)  {
    
    const wordsListLength = selectedList.words.filter(word => word).length
    const random = Math.floor(Math.random()*wordsListLength)
    console.log(selectedList.words[random].name)

    let word = (selectedList.words[random].name)
    randomWord.innerText = `${word}`
}

var team1Points = 0
var team2Points = 0

function gameLoop() {
let clickCounter = 0

randomWordButton.addEventListener('click', e => { 
    clickCounter++;
    console.log(clickCounter)

    if(clickCounter === 1 ) {
        startTimer() 
        gameSound.play()
       
        randomWordButton.innerHTML = 'next'
    }
    const selectedList = lists.find(list => list.id === selectedListId)
    random(selectedList)
    randomWord.style.visibility = 'visible'
})

    hideButtons()

    team1Button.addEventListener('click', e => {
        team1Points++
        
        team1Score.innerText = `${team1Points}`
        if(team1Points === 2 || team1Points === 2 ) {
            gameWinner()
            /* resetButton.style.visibility = 'visible' */
        }

        // reset the timer one score has been logged
        resetTimer();
        selectionButton.style.display = 'flex'
        randomWord.style.visibility = 'hidden'
        randomWordButton.style.display = 'none'
        categorySelection.style.display = 'flex'
        scoreboard.style.display = 'flex'
        countdown.style.visibility = 'hidden'
        showButton.style.display = 'flex'
        
        scoreButtonsHidden()
        // click count is set to zero at the end of each round 
        clickCounter = 0
        randomWordButton.innerHTML = 'start'  
    })

    team2Button.addEventListener('click', e => {
        team2Points++
        team2Score.innerText = `${team2Points}`
        if(team1Points === 2 || team2Points === 2 ) {
            gameWinner()
        }
        
        resetTimer();
        selectionButton.style.display = 'flex'
        randomWord.style.visibility = 'hidden'
        randomWordButton.style.display = 'none'
        categorySelection.style.display = 'flex'
        scoreboard.style.display = 'flex'
        countdown.style.visibility = 'hidden'
        showButton.style.display = 'flex'
        scoreButtonsHidden()
        clickCounter = 0
        randomWordButton.innerHTML = 'start'
    })

    redWinner.style.display = 'none'
    blueWinner.style.display = 'none' 
    function gameWinner() {
        if (team1Points === 2) {
            blueWinner.style.display = 'flex'
            
            winSound.play()
        }
        else if (team2Points === 2) {
            redWinner.style.display = 'flex'
           
            winSound.play()
        }
       disableButtons() 

       // resets game after 4 seconds once a winner has been declared
       setTimeout(rat, 5000);
       function rat() {
            window.location.reload()
   
       }
    }
    
    function disableButtons() {
       team1Button.disabled = true
       team2Button.disabled = true
       randomWordButton.disabled = true
       selectionButton.disabled = true
    }
    function hideButtons() {
        team1Button.style.display = 'none'
        team2Button.style.display = 'none'
        randomWordButton.style.display = 'none'
    }

// Select timeout Audio element
//const timeoutAudio = document.getElementById("timeout_audio");

// variable to store count
var remainingTime = 60
// variable to store time interval
var timer;
const startTimer = () => {
    countdown.innerHTML = remainingTime
    timer = setInterval(renderTime, 1000)

    if(remainingTime === 0) {
        stopTimer();
    }
}

const resetTimer = () => {
  clearInterval(timer)
  remainingTime = 60
  countdown.innerHTML = remainingTime
}

const gameSound = document.getElementById("game-sound")
const winSound = document.getElementById("win-sound")

timeoutSound.src = "timeup.wav"
gameSound.src = "timedcountdown.mp3"
winSound.src = "win.mp3"
timeoutSound.load()
gameSound.load()
winSound.load()

selectionButton.addEventListener('click', () =>{
  
    randomWordButton.style.display = 'flex'
    categorySelection.style.display = 'none'
    selectionButton.style.display = 'none'
    scoreboard.style.display = 'none'
    countdown.style.visibility = 'visible'
    showButton.style.display = 'none'
    hiddenCategoryAdded.style.display = 'none'
})

/* resetButton.addEventListener('click', () =>{
    resetTimer();
    randomWord.style.visibility = 'hidden'
    randomWordButton.style.visibility = 'hidden'
    categorySelection.style.visibility = 'visible'

}) */
function scoreButtonsHidden(){
    team1Button.style.display = 'none'
    team2Button.style.display = 'none'
}

function scoreButtonsVisible(){
    team1Button.style.display = 'flex'
    team2Button.style.display = 'flex'
}

// function to display time
const renderTime = () => {
  remainingTime -= 1
  // render count on the screen
  countdown.innerHTML = remainingTime
  
  /*   if(remainingTime <= 30) {
        gameSound.playbackRate = 1.5
    }
    if(remainingTime <= 20) {
        gameSound.playbackRate = 2.0
    }
  
    if(remainingTime <= 10) {
        gameSound.playbackRate = 2.3
    } */

    if (remainingTime === 0) {

        clearInterval(timer)
        scoreButtonsVisible()
        gameSound.pause();
        timeoutSound.play()

        remainingTime = 60
        selectionButton.style.display = 'none'
        randomWordButton.style.display = 'none'
    }  
}

}

gameLoop()

render()