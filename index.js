/*
    11061 - Hunter x hunter
    21 - One Piece
    1535 - Death Note
    20583 - Haikyuu!
    38000 - Demon Slayer
    20 - Naruto
    1735 - Naruto Shippuden

    Characters
    Killua - 27
    Kurapika - 28
    Gon - 30
    Kite - 20594
    Franky - 64
    Nami - 723
    Zoro - 62
    Leorio - 29


/anime/{id}/pictures
/characters/{id}/pictures
*/

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


const getBodyImage = async (img) => {
    try{
        const res = await fetch(`https://api.jikan.moe/v4/${img.type}/${img.num}/pictures`)
        if(!res.ok){
            throw new Error('Response status:', res.status)
        }

       const data = await res.json()

       const dataArr = data.data

       const getRandomImage = Math.floor(Math.random() * dataArr.length)

       img.type === `anime` ? document.body.style.backgroundImage = `url(${dataArr[getRandomImage].webp.large_image_url})` :

       document.body.style.backgroundImage = `url(${dataArr[getRandomImage].jpg.image_url})`

       return console.log(dataArr)

    }
    catch(error){
        document.body.style.backgroundImage = 'url(images/luffy_img.jpeg)'
        console.error('Error status:', error)
    }
}

getBodyImage(chooseAnimorCharNumber())