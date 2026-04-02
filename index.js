import mql from 'https://esm.sh/@microlink/mql'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'
import { wordleArrFive } from './wordle-data.js'
//Dictionary API for the Wordle to implement --- https://dictionaryapi.dev/

//Event Listeners for Link components, etc.

document.addEventListener('DOMContentLoaded', (e) => {
    createWordleBoxHtml()
    createKeyBoardHtml(wordle.keyboard)
}) 

document.addEventListener('keydown', (e) => {
    const pressedKey = e.key
    const isLetter = /^[a-zA-Z]$/.test(pressedKey)

    if(localStorage.getItem('wordleGameState') === "false"){
        if(isLetter){
        if(wordle.boxIndex < wordle.rowLimit()){
            updateTextViaKeyBoard(pressedKey)
        }
     } else if(pressedKey === `Backspace`){
        const rowStart = wordle.row * wordle.width

        if(wordle.boxIndex > rowStart){
            updateTextViaKeyBoard(pressedKey)
        }
     } else if(pressedKey === `Enter`){
        if(wordle.boxIndex === wordle.rowLimit() && wordle.row < 5){
            verifyWordleWord()
            wordle.newWord = []
            setTimeout(() => {
                wordle.row++
            }, 3 * 500)
        } else if(wordle.row === 5 && wordle.boxIndex === wordle.rowLimit()){
            verifyWordleWord()
            alert(`Dat's it!`)
        } else{
            alert('Please enter words!')
        }
     }
    } else{
        alert(`You Won!, Game Over! Stay tune for the new word tomorrow!`)
    }
})

document.addEventListener('submit', async (e) => {
    if(e.target.id === 'link-form'){
        e.preventDefault()
        const linkInput = document.getElementById('link-input')

        const userInput = fixAnyInputLink(linkInput.value)

        const linkDataArr = await getLinkArr(userInput)

        if(userInput !== ''){
            renderLink(linkDataArr)
            linkInput.value = ''
        } else{
            alert('Please enter a link')
        }
    }
})

document.addEventListener('click', (e) => {

    const mainDash = document.querySelector('.dash-container')
    const pomoDash = document.querySelector('.pomo-container')
    const wordleDash = document.querySelector('.wordle-container')
    
    if(e.target.dataset.linkId){
        mainLinkArr.deleteLink(e.target.dataset.linkId)

    } else if(e.target.id === 'focus'){
        pomoDash.classList.toggle('hidden')
        mainDash.classList.toggle('hidden')
    } 
    else if(e.target.id === 'return-pomo'){
        pomoDash.classList.toggle('hidden')
        mainDash.classList.toggle('hidden')

    } else if(e.target.id === 'wordle'){
        mainDash.classList.toggle('hidden')
        wordleDash.classList.toggle('hidden')

    } else if(e.target.id === 'return-wordle'){
        wordleDash.classList.toggle('hidden')
        mainDash.classList.toggle('hidden')

    } else if(e.target.id === 'play-pause'){
        pomoDoro.activePomo()

    } else if (e.target.dataset.keyId){
        if(localStorage.getItem('wordleGameState') === "false"){ 
            if(e.target.dataset.keyId === 'Enter'){
            alert('Press Enter on your keyboard')
        } else if(e.target.dataset.keyId === 'Backspace'){
             alert('Press Backspace on your keyboard')
        }
         else{
            updateTextViaDiv(e.target.dataset.keyId)
        }
        } else{
             alert(`You Won!, Game Over! Stay tune for the new word tomorrow!`)
        }
    }
})

//Wordle Component

const wordleMethods = () => {

    let boxIndex = 0
    let rowLimit = 0
    let row = 0

    localStorage.setItem('row', JSON.stringify(row))
    let offRow = Number(localStorage.getItem('row'))
    localStorage.setItem('boxIndex', JSON.stringify(boxIndex))
    let offBoxIndex = Number(localStorage.getItem('boxIndex'))
    
    return {
        keyboard: [
           ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',], 
             ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L','È', 'Ò'],
             ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', `⌫`,],
        ],
        mainArray: wordleArrFive,
        height: 6,
        width: 5,
        sWidth: 6,
        row: offRow
        ,
        getRandomArr: function() {
            const getRandomArr = Math.floor(Math.random() * this.mainArrays.length)
            let mainArr = this.mainArrays[getRandomArr]

            return mainArr
        },
        html: function(){
            for(let height = 0; height < 6; height++){
                for(let row = 0; row < 5; row++){
                    let tile = document.createElement('span')
                    tile.id = height.toString() + '-' + row.toString()
                    tile.classList.add('wordle-box')
                    tile.innerText = ' '
                    const wordleBoard = document.getElementById('board')
                    //if(arr[0].length === 6){
                        //wordleBoard.style.gridTemplateColumns = 'auto auto auto auto auto auto'
                    //} else{
                        wordleBoard.style.gridTemplateColumns = 'auto auto auto auto auto'
                    //}
                    wordleBoard.appendChild(tile)
            }
            }
        },
        getRandomWord: function(arr){
            const getRandomWord = Math.floor(Math.random() * arr.length)
            return arr[getRandomWord]
        },
        gameOver: false,
        geussWord: false,
        wordleNumCount: 0,
        boxIndex: offBoxIndex
        ,
        rowLimit: function(){
            rowLimit = (this.row + 1) * this.width
            localStorage.setItem('rowLimit', JSON.stringify(rowLimit))
            let offRowLimit = Number(localStorage.getItem('rowLimit'))
            return offRowLimit
        },
        newWord: [],
        theWord: function(){
            return localStorage.getItem('wordOfTheDay')
        },
    }
}

const wordle = wordleMethods()


const wordleWordColors = () => {
    const wordleBox = document.querySelectorAll('.wordle-box')
    const wordleKeyData = document.querySelectorAll('.wordle-keys')
    const keyframes = [
                {transform: 'scaleY(1)', backgroundColor: 'transparent'},
                {transform: 'scaleY(0)'},
                {transform: 'scaleY(1)'}
              ]

              const options = {
                easing: 'ease',
                duration: 1000,
              }

    let testWord = wordle.theWord().split('')

    wordle.newWord.forEach((key, i) => {
        setTimeout(() => {
            if(key === testWord[i]){
              wordleBox[i + (wordle.row * wordle.width)].animate(keyframes, options)
              wordleBox[i + (wordle.row * wordle.width)].style.backgroundColor = `green`

              wordleKeyData.forEach((word) => {
                    if(key === word.textContent){
                        word.style.backgroundColor = `green`
                    }
                })
            } 
            
            if(testWord.includes(key) && wordleBox[i + (wordle.row * wordle.width)].style.backgroundColor !== `green`){
                wordleBox[i + (wordle.row * wordle.width)].animate(keyframes, options)
                wordleBox[i + (wordle.row * wordle.width)].style.backgroundColor = `#FFD300`

                wordleKeyData.forEach((word) => {
                    if(key === word.textContent){
                        word.style.backgroundColor = `#FFD300`
                    }
                })
            }
        }, ((i + 1) * 500)/ 2)
        }) 
}

const verifyWordleWord = () => {
    let fullString = wordle.newWord.join('')

    if(fullString === wordle.theWord()){
        wordleWordColors()
        wordle.geussWord = true
        localStorage.setItem('wordleGameState', JSON.stringify(wordle.geussWord))
        wordle.newWord = []
        alert('Correct!')
    } else{
        wordleWordColors()
        alert('Try again!')
    }
} 

const updateTextViaKeyBoard = (keyId) => {
    const wordleBox = document.querySelectorAll('.wordle-box')
    let key = `${keyId}`
    let newString = key.toUpperCase()

    if(key === `Backspace`){
        wordleBox[Math.max(0, wordle.boxIndex - 1)].textContent = ``
        wordle.newWord.pop(newString)
        wordle.boxIndex--
        wordle.wordleNumCount--
    }
     else{
        wordleBox[Math.max(0, wordle.boxIndex)].textContent = newString
        wordle.newWord.push(newString)
        wordle.boxIndex++
        wordle.wordleNumCount++
    }
}


const updateTextViaDiv = (keyId) => {
    const wordleBox = document.querySelectorAll('.wordle-box')
    let key = `${keyId}`
    let newString = key.replace('Key', '')

     if(key === `Backspace`){
        wordleBox[Math.max(0, wordle.boxIndex() - 1)].textContent = ``
        wordle.newWord.pop(newString)
        wordle.boxIndex()--
        wordle.wordleNumCount--
    }
     else{
        wordleBox[Math.max(0, wordle.boxIndex())].textContent = newString
        wordle.newWord.push(newString)
        wordle.boxIndex()++
        wordle.wordleNumCount++
    }
}


const createKeyBoardHtml = (arr = []) => {
    for(let i = 0; i < arr.length; i++){
        let row = arr[i]
        let keyboardRow = document.createElement('div')
        keyboardRow.classList.add('k-row')
        const wordleKeyRows = document.getElementById('keyboard')
        wordleKeyRows.appendChild(keyboardRow)

        for(let n = 0; n < row.length; n++){
            let keys = document.createElement('button')
            keys.dataset.keyId = row[n]
            keys.classList.add('wordle-keys')
            keys.innerText = row[n]
            if(row[n] === 'ENTER'){
                keys.dataset.keyId = 'Enter'
            } else if(row[n] === '⌫'){
                keys.dataset.keyId = 'Backspace'
            } else if('A' <= row[n] && row[n] <= 'Z'){ //checks if a specific character is uppercase btw A and Z
                keys.dataset.keyId = `Key` + row[n]
            }
            const wordleKeyBoard = document.querySelectorAll('.k-row')
            wordleKeyBoard.forEach((key) => {
                return key.appendChild(keys)
            })
        }
    }
}

const createWordleBoxHtml = () => {
    for(let height = 0; height < 6; height++){
                for(let row = 0; row < 5; row++){
                    let tile = document.createElement('span')
                    tile.id = height.toString() + '-' + row.toString()
                    tile.classList.add('wordle-box')
                    tile.innerText = ' '
                    const wordleBoard = document.getElementById('board')
                    //if(arr[0].length === 6){
                        //wordleBoard.style.gridTemplateColumns = 'auto auto auto auto auto auto'
                    //} else{
                        wordleBoard.style.gridTemplateColumns = 'auto auto auto auto auto'
                    //}
                    wordleBoard.appendChild(tile)
            }
            }
}


//Pomodoro Timer Component

const pomoMethods = () => {

    let countDown
    let endTime = Date.now() + countDown * 1000
    let currentDuration 
    let pausedTimeRemaining = 1500
    let timerId = null
    
    return {
        mainPomoTime: {
            time: 1500,
            //color: {background: "rgb(255, 146, 172)", border: "rgb(149, 9, 41)"},
        },
        shortPomoTime: {
            time: 300,
            //color: {background: "rgb(187, 255, 179)", border: "rgb(10, 97, 84)"}
        },
        longPomoTime: {
            time: 900,
            //color: {background: "rgb(134, 140, 255)", border: "rgb(19, 27, 175)"}
        },
        buttonSound: new Audio('sounds/select-button.mp3'),
        bellSound: new Audio('sounds/yeat-bell-sound.mp3'),
        //backgroundMusic: new Audio('sounds/hip_hop_mario.mp3'), for another time
        //pomoCompletion: new Audio('sounds/anotherone.mp3'), for another time
        timerStarted: false,
        timerPaused: true,
        endTime: endTime,
        countD: countDown,
        count: 1,
        cycleCount: 1,
        currentDur: currentDuration,
        timer: function(){
            if(timerId !== null){
                return
            }
            timerId = setInterval(() => {
            if(!this.timerPaused){
                const currentTime = Date.now()
                const remainingTime = Math.ceil((this.endTime - currentTime)/1000)

                if(remainingTime <= 0){
                    clearInterval(timerId)
                    timerId = null
                    handleTimerEnd()
                    this.cycleCount++
                    return
                }

                this.countD = remainingTime
                updateTimer(this.countD)

                const progress = (this.countD/this.currentDur) * 360
                updateCircle(progress)
            }
        }, 1000)
        },
        ptr: pausedTimeRemaining,
        activePomo: function(){

            this.buttonSound.play()

            this.timerPaused = !this.timerPaused

            const playPause = document.getElementById('play-pause')

            if(this.timerPaused) {
                playPause.textContent = 'Play'
                this.ptr = Math.ceil((this.endTime - Date.now())/1000)
            } 
            else{
                playPause.textContent = 'Pause'
                this.endTime = Date.now() + this.ptr * 1000
            }

            if(!this.timerStarted){
                startTimer()
            }
        },
    }
}

const pomoDoro = pomoMethods()

const startTimer = () => {

    if(!pomoDoro.timerStarted){
        pomoDoro.timerStarted = true

        pomoDoro.timer()
    }
}

const updateCircle = (degree) => {
    const innerCircle = document.querySelector('.inner-circle')
    innerCircle.style.background = `conic-gradient(blue ${degree}deg, transparent 0%)`
}

const handleTimerEnd = () => {
    pomoDoro.countD = 0
    const playPause = document.getElementById('play-pause')
    playPause.style.display = 'none'

    pomoDoro.bellSound.play()
    
    updateTimer(0)
    
    updateCircle(0)

    setTimeout(() => {
       const changeDisplay = pomoDoro.cycleCount % 8

       const pomoDoroCount = document.getElementById('num-of-pd')
       const longCountBtn = document.getElementById('l-break')
       const shortCountBtn = document.getElementById('s-break')
       const normalCountBtn = document.getElementById('pdoro')

    if(changeDisplay === 0){
        resetTimer(pomoDoro.longPomoTime.time)
        pomoDoro.currentDur = pomoDoro.longPomoTime.time
        pomoDoro.countD = pomoDoro.longPomoTime.time
        pomoDoro.timerPaused = true
        playPause.textContent = 'Play'
        longCountBtn.disabled = false
        shortCountBtn.disabled = true
        normalCountBtn.disabled = true
    }

    else if(changeDisplay % 2 === 0){
        resetTimer(pomoDoro.shortPomoTime.time)
        pomoDoro.currentDur = pomoDoro.shortPomoTime.time
        pomoDoro.countD = pomoDoro.shortPomoTime.time
        pomoDoro.timerPaused = true
        playPause.textContent = 'Play'
        longCountBtn.disabled = true
        shortCountBtn.disabled = false
        normalCountBtn.disabled = true
    } else {
        resetTimer(pomoDoro.mainPomoTime.time)
        pomoDoro.currentDur = pomoDoro.mainPomoTime.time
        pomoDoro.countD = pomoDoro.mainPomoTime.time
        pomoDoro.timerPaused = true
        playPause.textContent = 'Play'
        pomoDoro.count++
        pomoDoroCount.textContent = `#${pomoDoro.count}`
        longCountBtn.disabled = true
        shortCountBtn.disabled = true
        normalCountBtn.disabled = false
        }
    }, 1000)
}

const updateTimer = (timeInSeconds) => {
    let minutes = Math.floor(timeInSeconds / 60)
    let seconds = timeInSeconds % 60

    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    const pomoTimeDisplay = document.querySelector('.countdown h1')
    pomoTimeDisplay.textContent = `${minutes}:${seconds}`

    if(pomoDoro.timerStarted){
        document.title = `Timer: ${minutes}:${seconds}`
    }
}

const resetTimer = (duration) => {
    const playPause = document.getElementById('play-pause')
    
    clearInterval(pomoDoro.timer())

    pomoDoro.timerStarted = false

    pomoDoro.timerPaused = true

    pomoDoro.countD = duration

    pomoDoro.currentDur = duration

    pomoDoro.ptr = duration

    updateTimer(duration)

    playPause.style.display = 'block'

    playPause.textContent = 'Play'

    //Update the colors(for another time)

}

const initialCount = (count = 1) => {
    const pomoDoroCount = document.getElementById('num-of-pd')
    pomoDoroCount.textContent = `# ${count}`
}

/*
Feature for another time
const changeTimer = (time) => {
    updateTimer(time)
    pomoDoro.ptr = time
} */

initialCount()

resetTimer(pomoDoro.mainPomoTime.time)


//Link component

const getLinkHTML = (arr) => {
    return arr.map((web) => {
        return `
        <div>
            <a class="link-flex" href="${web.linkName}" target="_blank">
                <div>
                    <img width="32px" height="32px" src="${web.linkImg}">
                    <p>${web.linkTitle}</p>
                </div>
            </a>
            <button>
                     <i data-link-id="${web.uuid}" class="fa-solid fa-x"></i>
            </button>
        </div>
        `
    }).join('')
}

const fixAnyInputLink = (website) => {
    let inputURL = website.trim()

    if(!/^https?:\/\//i.test(inputURL)){
        inputURL = `https://${inputURL}`
    }

    const cleanURL = new URL(inputURL)

    if(!cleanURL.hostname.includes('.')){
        return alert('Please enter a link with .com/.edu and.etc')
    } else if(!cleanURL){
        return alert('Please enter a real website')
    } else{
        return cleanURL.toString()
    }
}

const getLinkTitle = async (website) => {
    try {
        const { data } = await mql(`${website}`)

        return data.publisher
        
    } catch (error) {
        console.error(`Error status: `, error)
        return website.replace('https://', '')
    }
}

const getLinkImage = async (website) => {
    try {
        const { data } = await mql(`${website}`)
        
        return data.logo.url   

    } catch (error) {
        console.error(`Error status: `, error)
         return `images/noimage.png`
    }
}

const createLinkArr = () => {
    let localStorsLinkArr = JSON.parse(localStorage.getItem('mainArrLink'))
    let linkArr = []

    if(!localStorsLinkArr){
        localStorsLinkArr = linkArr
        localStorage.setItem('mainArrLink', JSON.stringify(linkArr))
    }

    return {
        newLink: function(link){
            localStorsLinkArr.push(link)
            localStorage.setItem('mainArrLink', JSON.stringify(localStorsLinkArr))
        },
        getLinks: function(){
            return localStorsLinkArr
        },
        deleteLink: function(link) {
            localStorsLinkArr = localStorsLinkArr.filter((website) => {
                if(link === website.uuid){
                    return false
                }

                    return true
            })

            localStorage.setItem('mainArrLink', JSON.stringify(localStorsLinkArr))
            renderLink(localStorsLinkArr)
        }
    }
}

const mainLinkArr = createLinkArr()

const getLinkArr = async (website) => {
    const title = await getLinkTitle(website)
    const image = await getLinkImage(website)

    mainLinkArr.newLink({
        linkTitle: title,
        linkImg: image,
        linkName: website,
        uuid: uuidv4(),
    })

    return mainLinkArr.getLinks()
}


const renderLink = (arr = []) => {
    const linkDivWrap = document.getElementById('linkdiv-wrap')
    return linkDivWrap.innerHTML = getLinkHTML(arr)
}

renderLink(mainLinkArr.getLinks())

//Clock

const getTime = () => {
    const timeOfDay = new Date()

    const time = document.getElementById('time')

    time.textContent = timeOfDay.toLocaleTimeString("en-us", {timeStyle: "long"})
}

setInterval(getTime, 1000)

//Background Image

const chooseAnimorCharNumber = () => {

    const imageArr = [
        {type: 'anime', num: 11061}, 
        {type: 'anime', num: 21},
        {type: 'anime', num: 1535},
        {type: 'anime', num: 20583},
        {type: 'anime', num: 38000},
        {type: 'anime', num: 20},
        {type: 'anime', num: 1735},
        {type: 'characters', num: 27},
        {type: 'characters', num: 28},
        {type: 'characters', num: 30},
        {type: 'characters', num: 20594},
        {type: 'characters', num: 64},
        {type: 'characters', num: 723},
        {type: 'characters', num: 62},
        {type: 'characters', num: 29},
        {type: 'characters', num: 13767},
        {type: 'characters', num: 309},
        {type: 'characters', num: 724},
        {type: 'characters', num: 5627},
        {type: 'characters', num: 305},
        {type: 'characters', num: 61},
        {type: 'characters', num: 18938},
        {type: 'characters', num: 2072},
        {type: 'characters', num: 727},
        {type: 'characters', num: 2064},
        {type: 'characters', num: 2751},
    ]

    const getRandomImage = Math.floor(Math.random() * imageArr.length)

    return imageArr[getRandomImage]

}


const getBodyImage = async (img = {}) => {
    
    try{
        const res = await fetch(`https://api.jikan.moe/v4/${img.type}/${img.num}/pictures`)
        if(!res.ok){
            throw new Error(`Response status: ${res.status}`)
        }

       const data = await res.json()

       const dataArr = data.data

       const getRandomImage = Math.floor(Math.random() * dataArr.length)

       if(img.type === 'anime'){
            document.body.style.backgroundImage = `url(${dataArr[getRandomImage].webp.large_image_url}), linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))`
            localStorage.setItem('bodyImage', `url(${dataArr[getRandomImage].webp.large_image_url}), linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))`)
       } else{
            document.body.style.backgroundImage = `url(${dataArr[getRandomImage].jpg.image_url}), linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))`
            localStorage.setItem('bodyImage', `url(${dataArr[getRandomImage].jpg.image_url}), linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))`)
       }

    }
    catch(error){
        document.body.style.backgroundImage = 'url(images/zoro.jpg), linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))'
        console.error('Error status: ', error)
    }
}

const getLocalStorageItemsOnceADay = () => {

   const todayDate = new Date().toLocaleDateString()
   const lastDate = localStorage.getItem('lastDate')
   let randomWord = wordle.getRandomWord(wordleArrFive)

   if(!lastDate){
    localStorage.setItem('lastDate', new Date().toLocaleDateString())
   } else if(!localStorage.getItem('bodyImage')){
    localStorage.setItem('bodyImage', `url(images/zoro.jpg), linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))`)
   } else if(!localStorage.getItem('wordOfTheDay')){
    localStorage.setItem('wordOfTheDay', `${randomWord.toUpperCase()}`)
   } else if(!localStorage.getItem('wordleGameState')){
    localStorage.setItem('wordleGameState', JSON.stringify(wordle.geussWord))
   }

   if(todayDate !== lastDate){
    localStorage.removeItem('')
    getBodyImage(chooseAnimorCharNumber())
    localStorage.setItem('wordOfTheDay', `${randomWord.toUpperCase()}`)
    localStorage.setItem('wordleGameState', JSON.stringify(false))
    localStorage.setItem('lastDate', todayDate)
   } else{
    document.body.style.backgroundImage = localStorage.getItem('bodyImage')
   }
}

getLocalStorageItemsOnceADay()

