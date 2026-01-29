import mql from 'https://esm.sh/@microlink/mql'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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
    } 
})

//Pomodoro Timer

//Using a simpler method

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


