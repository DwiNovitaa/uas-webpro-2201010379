$(document).ready(function() {
    const wrapper = $(".wrapper");
    const searchInput = wrapper.find("input");
    const volume = wrapper.find(".word i");
    const infoText = wrapper.find(".info-text");
    const synonyms = wrapper.find(".synonyms .list");
    const removeIcon = wrapper.find(".search span");
    let audio;

    function data(result, word) {
        if (result.title) {
            infoText.html(`Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`);
        } else {
            wrapper.addClass("active");
            let definitions = result[0].meanings[0].definitions[0];
            let phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
            $(".word p").text(result[0].word);
            $(".word span").text(phontetics);
            $(".meaning span").text(definitions.definition);
            $(".example span").text(definitions.example);
            audio = new Audio(result[0].phonetics[0].audio);

            if (definitions.synonyms[0] == undefined) {
                synonyms.parent().hide();
            } else {
                synonyms.parent().show();
                synonyms.html("");
                for (let i = 0; i < 5; i++) {
                    let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                    tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                    synonyms.append(tag);
                }
            }
        }
    }

    function search(word) {
        fetchApi(word);
        searchInput.val(word);
    }

    function fetchApi(word) {
        wrapper.removeClass("active");
        infoText.css("color", "#000");
        infoText.html(`Searching the meaning of <span>"${word}"</span>`);
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        $.ajax({
            url: url,
            dataType: "json",
            success: function(result) {
                data(result, word);
            },
            error: function() {
                infoText.html(`Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`);
            }
        });
    }

    searchInput.on("keyup", function(e) {
        let word = e.target.value.replace(/\s+/g, ' ');
        if (e.key == "Enter" && word) {
            fetchApi(word);
        }
    });

    volume.on("click", function() {
        volume.css("color", "#4D59FB");
        audio.play();
        setTimeout(function() {
            volume.css("color", "#999");
        }, 800);
    });

    removeIcon.on("click", function() {
        searchInput.val("");
        searchInput.focus();
        wrapper.removeClass("active");
        infoText.css("color", "#9A9A9A");
        infoText.html("Type any existing word and press enter to get meaning, example, synonyms, etc.");
    });
});
