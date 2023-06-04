
const lightMode = {
    "--primary": "#0385fc",
    "--header": "#0385fc",
    "--button": "#0385fc",
    "--light": "#ffffff",
    "--background": "#e2e2e2",
    "--hover": "#0d6cc3",
    "--text": "#000",
};

const darkMode = {
    "--primary": "#0385fc",
    "--header": "#0385fc",
    "--button": "#0385fc",
    "--light": "#242933",
    "--background": "#3f495e",
    "--hover": "#0d6cc3",
    "--text": "#fff",
};



document.addEventListener("DOMContentLoaded", () => {

    const buttonLabels = ['One More Joke', 'Hit Me Again', 'I Know You Want It', 'Once Again', 'More Please', 'Give Me More', 'Next', 'Another One', 'Again', 'More', 'Last One']
    const colors = [
        {
            color: '#0385fc',
            hover: '#0d6cc3'
        }, {
            color: '#B42E2E',
            hover: '#AB1111'
        }, {
            color: '#484745',
            hover: '#57524A'
        }, {
            color: '#5E17EB',
            hover: '#5610E1'
        }, {
            color: '#07DD90',
            hover: '#099965'
        }, {
            color: '#EB1717',
            hover: '#DD0D1D'
        }
    ]

    const buttonName = "one-more";
    const me = "me"
    const themeSlider = "themeSlider"
    const url = "https://icanhazdadjoke.com"
    const headers = { "Accept": "application/json" }
    const linkedInURL = 'https://www.linkedin.com/in/sandeep-b/'
    const likeBtn = document.getElementById('like')
    const dislikeBtn = document.getElementById('dislike')
    const likeCount = document.getElementById('likeCount')
    const dislikeCount = document.getElementById('dislikeCount')
    const oneMoreButton = document.getElementById(buttonName);
    const dp = document.getElementById(me);
    const themeToggler = document.getElementById(themeSlider)
    const jokeContainer = document.getElementById("joke");
    let likes = 0;
    let dislikes = 0;


    const getJoke = async () => {
        oneMoreButton.disabled = true;
        oneMoreButton.style.cursor = "progress"
        const joke = await fetch(url, { headers: headers })
            .then(response => response.json())
            .then(json => json.joke)
            .catch(() => "No Internet Connection");
        jokeContainer.innerHTML = joke;
        oneMoreButton.disabled = false;
        oneMoreButton.style.cursor = "pointer";
    }

    const getInitialJoke = () => {
        oneMoreButton.innerHTML = buttonLabels[0];
        getJoke();
    }

    const onMoreJokeClick = () => {
        oneMoreButton.innerHTML = getRandomItem(buttonLabels);
        const selectedColor = getRandomItem(colors);
        document.documentElement.style.setProperty('--button', selectedColor.color);
        document.documentElement.style.setProperty('--hover', selectedColor.hover);
        getJoke();
    }

    // program to get a random item from an array

    function getRandomItem(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        const item = arr[randomIndex];
        return item;
    }


    const onMouseOverButton = (button) => {
        const value = `${Math.ceil(Math.random() * 100)}%`
        console.log(value)
        if (Math.round(Math.random() * 1 === 0)) {
            button.style.marginRight = value;
        } else {
            button.style.marginLeft = value;
        }
    }

    const gotoProfile = () => {
        window.open(linkedInURL, '_blank');

    }

    const onLikeclicked = () => {
        chrome.storage.sync.set({ 'like': ++likes }, function () {
            likeCount.innerHTML  = likes
        });
    }

    const onDisLikeclicked = () => {
        chrome.storage.sync.set({ 'dislike': ++dislikes }, function () {
            dislikeCount.innerHTML = dislikes
        });
    }


    getInitialJoke(); // initial joke
    oneMoreButton.addEventListener("click", onMoreJokeClick);
    dp.addEventListener("click", gotoProfile);
    likeBtn.addEventListener('click', onLikeclicked)
    dislikeBtn.addEventListener('click', onDisLikeclicked)




    themeToggler && themeToggler.addEventListener('change', ($event) => {
        toggleTheme($event.currentTarget.checked)
    })


    chrome.storage.sync.get(['darktheme'], function (result) {
        console.log(result)
        if (result.darktheme) {
            makeStrcture(darkMode)
            themeToggler.checked = true;
        } else {
            makeStrcture(lightMode);
            themeToggler.checked = false
        }
    });

    chrome.storage.sync.get(['like'], function (result) {
        likes = result.like
        likeCount.innerHTML = result.like
    });

    chrome.storage.sync.get(['dislike'], function (result) {
        dislikes = result.dislike
        dislikeCount.innerHTML = result.dislike
    });

});





const saveToStorage = (status) => {
    chrome.storage.sync.set({ 'darktheme': status }, function () {
        console.log('Value is set to ' + status);
    });
}

const toggleTheme = (darkthemeEnabled) => {
    darkthemeEnabled ? makeStrcture(darkMode) : makeStrcture(lightMode)
    saveToStorage(darkthemeEnabled)
}

const makeStrcture = (rootVariables) => {
    let temp = ''
    Object.entries(rootVariables).forEach(variable => {
        temp += `${variable[0]} : ${variable[1]}; `
    });
    const body = `:root {${temp}}`
    insertToDom(body)
}

const insertToDom = (content) => {
    const existingVariables = document.getElementById('theme-variables')
    if (existingVariables) {
        existingVariables.remove()
    }
    const ele = document.createElement('style');
    ele.id = "theme-variables"
    ele.textContent = content;
    document.head.appendChild(ele);
}

