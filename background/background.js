const GOOGLE_SPEECH_URI = 'https://www.google.com/speech-api/v1/synthesize';

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { word, lang } = request, 
        url = `https://www.google.com/search?hl=${lang}&q=define+${word}&gl=US`;
    // console.log('url: '+url)
    fetch(url, { 
            method: 'GET',
            credentials: 'omit'
        })
        .then((response) => response.text())
        .then((text) => {
            const document = new DOMParser().parseFromString(text, 'text/html'),
                content = extractMeaning(document, { word, lang });

            sendResponse({ content });

        })

    return true;
});

function extractMeaning (document, context) {
    if (!document.querySelector("[data-dobid='hdw']")) { return null; }

    var word = document.querySelector("[data-dobid='hdw']").textContent,
        definitionDiv = document.querySelector("div[data-mh='-1']"),
        meaning = "";

    if (definitionDiv) {
        const liElements = document.querySelectorAll("li.LTKOO");
        liElements.forEach(function(liElement) {
            const textContent = liElement.textContent;
            meaning = meaning + "\n" + textContent
        });

        if (meaning===""){
            liElementsstep2 = document.querySelector("div[data-dobid='dfn']");
            liElementsstep2.querySelectorAll("span").forEach(function(span){
                if(!span.querySelector("sup"))
                     meaning = meaning +"\n"+ span.textContent;
            });
        }
    }
    // console.log('meaning: '+meaning)

    var audio = document.querySelector("audio[jsname='QInZvb']"),
        source = document.querySelector("audio[jsname='QInZvb'] source"),
        audioSrc = source && source.getAttribute('src');

    if (audioSrc) {
        !audioSrc.includes("http") && (audioSrc = audioSrc.replace("//", "https://"));
    }
    else if (audio) {
        let exactWord = word.replace(/·/g, ''), // We do not want syllable seperator to be present.
            
        queryString = new URLSearchParams({
            text: exactWord, 
            enc: 'mpeg', 
            lang: context.lang, 
            speed: '0.4', 
            client: 'lr-language-tts', 
            use_google_only_voices: 1
        }).toString();

        audioSrc = `${GOOGLE_SPEECH_URI}?${queryString}`;
    }

    return { word: word, meaning: meaning, audioSrc: audioSrc };
};
