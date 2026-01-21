
//Links

document.addEventListener('submit', (e) => {
    if(e.target.id === 'link-form'){
        e.preventDefault()
        const linkInput = document.getElementById('link-input')
        const linkDivWrap = document.getElementById('linkdiv-wrap')
        getFaviconImage(linkInput.value)
        renderLink(linkInput.value)
    }
})

const getFaviconImage = (website) => {
    console.log(`https://favicone.com/${website}?json`)
}

const getLinkHTML = (website) => {
   return `
        <div class="show">
            <img src="${`https://favicone.com/${website}`}">
            <p>${getLinkTitle(website)}</p>
        </div>
    `
}

const getLinkTitle = async (website) => {
    try {
        const res = await fetch(`https://title.mihir.ch/https://${website}`)

        if(!res.ok){
            throw new Error(`Response status: ${res.status}`)
        }

        const data = await res.json()

        return `${data}`

    } catch (error) {
        console.error(`Error status: `, error)
    }
}

const renderLink = (website) => {
    const linkDivWrap = document.getElementById('linkdiv-wrap')
    return linkDivWrap.innerHTML += getLinkHTML(website)
}

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


