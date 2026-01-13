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

const chooseAnimOrCharTitle = () => {
    const topic = ['anime', 'character']

    const randomTopic = Math.floor(Math.random() * topic.length)

    return topic[randomTopic]
}

const chooseAnimorCharNumber = (char) => {
    
    const animeNumArr = [11061, 21, 1535, 20583, 38000, 20, 1735]

    const charNumArr = [27, 28, 30, 20594, 64, 723, 62, 29]

    if(char === 'anime'){
        const randomAnime = Math.floor(Math.random() * animeNumArr.length)

        return animeNumArr[randomAnime]
    } else {
        const randomChar = Math.floor(Math.random() * charNumArr.length)

        return charNumArr[randomChar]
    }
}

console.log(chooseAnimOrCharTitle())

console.log(chooseAnimorCharNumber(chooseAnimOrCharTitle()))

const getBodyImage = async (char, num) => {
    try{
        const res = await fetch(`https://api.jikan.moe/v4/${char}/${num}/pictures`)
        if(!res.ok){
            throw Error('Error status:', res.status)
        }

        const data = await res.json()

        return console.log(data.data)

    }
    catch(error){
        console.error('Error status:', error)
    }
}

getBodyImage('anime', 30)