//import mql from 'https://esm.sh/@microlink/mql'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const loadModule = async () => {

    try{
        const microLink = await import('https://esm.sh/@microlink/mql')
        if(!microLink.ok){
           throw new Error(`Response status: ${microLink.status}`)
        }
        return microLink
    } catch(error){
        console.error(`Error status: `, error)
        return
    }
}

loadModule()

//Event Listeners for Link components, etc.

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
    
    if(e.target.dataset.linkId){
        mainLinkArr.deleteLink(e.target.dataset.linkId)
    } else if(e.target.id === 'focus'){
        pomoDash.classList.toggle('hidden')
        mainDash.classList.toggle('hidden')
    } 
    else if(e.target.id === 'return'){
        pomoDash.classList.toggle('hidden')
        mainDash.classList.toggle('hidden')
    } else if(e.target.id === `play-pause`){
        pomoDoro.activePomo()
    } else if(e.target.dataset.time === '1500'){
        changeTimer(1500)
        pomoDoro.ptr = 1500
    } else if(e.target.dataset.time === '900'){
        changeTimer(900)
        pomoDoro.ptr = 900
    } else if(e.target.dataset.time === '300'){
        changeTimer(300)
        pomoDoro.ptr = 300
    }
})

//Pomodoro Timer

const pomoMethods = () => {

    let countDown
    let endTime = Date.now() + countDown * 1000
    let currentDuration 
    let pausedTimeRemaining = 1500
    
    return {
        mainPomoTime: {
            time: 1500,
            color: {background: "rgb(255, 146, 172)", border: "rgb(149, 9, 41)"}
        },
        shortPomoTime: {
            time: 300,
            color: {background: "rgb(187, 255, 179)", border: "rgb(10, 97, 84)"}
        },
        longPomoTime: {
            time: 900,
            color: {background: "rgb(134, 140, 255)", border: "rgb(19, 27, 175)"}
        },
        buttonSound: new Audio('sounds/select-button.mp3'),
        bellSound: new Audio('sounds/yeat-bell-sound.mp3'),
        backgroundMusic: new Audio('sounds/hip_hop_mario.mp3'),
        pomoCompletion: new Audio('sounds/anotherone.mp3'),
        timerStarted: false,
        timerPaused: true,
        endTime: endTime,
        countD: countDown,
        currentDur: currentDuration,
        timer: function(){
            setInterval(() => {
            if(!this.timerPaused){
                const currentTime = Date.now()
                const remainingTime = Math.ceil((this.endTime - currentTime)/1000)

                if(remainingTime <= 0){
                    clearInterval(this.timer())
                    handleTimerEnd()
                    return
                }

                this.countD = remainingTime
                updateTimer(this.countD)

                const progress = (this.countD/this.currentDur) * 360
                //function to update time circle
            }
        }, 1000)
        },
        ptr: pausedTimeRemaining,
        activePomo: function(){

            this.buttonSound.play()

            this.timerPaused = !this.timerPaused

            const playPause = document.getElementById('play-pause')
            playPause.textContent = this.timerPaused ? 'Play' : 'Pause'

            if(this.timerPaused) {
                this.ptr = Math.ceil((this.endTime - Date.now())/1000)
            } 
            else{
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

const handleTimerEnd = () => {
    pomoDoro.countD = 0
    const playPause = document.getElementById('play-pause')
    playPause.style.display = 'none'

    pomoDoro.bellSound.play()
    updateTimer(0)
    //Update the circle

    setTimeout(() => {
        resetTimer(pomoDoro.mainPomoTime.time)
        pomoDoro.currentDur = pomoDoro.mainPomoTime.time
        pomoDoro.countD = pomoDoro.mainPomoTime.time
        pomoDoro.timerPaused = true
        playPause.textContent = 'Play'
    }, 5000)
}

const updateTimer = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60

    const pomoTimeDisplay = document.querySelector('.countdown h1')
    pomoTimeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
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

    //Update the colors

}

const changeTimer = (time) => {
    updateTimer(time)
}

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

const getImgOnceADay = () => {

   const todayDate = new Date().toLocaleDateString()
   const lastDate = localStorage.getItem('lastDate')

   if(!lastDate){
    localStorage.setItem('lastDate', new Date().toLocaleDateString())
   } else if(!localStorage.getItem('bodyImage')){
    localStorage.setItem('bodyImage', `url(images/zoro.jpg), linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))`)
   }

   if(todayDate !== lastDate){
    getBodyImage(chooseAnimorCharNumber())
    localStorage.setItem('lastDate', todayDate)
   } else{
    document.body.style.backgroundImage = localStorage.getItem('bodyImage')
   }
}

getImgOnceADay()


