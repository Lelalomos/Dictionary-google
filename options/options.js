const DEFAULT_LANGUAGE = 'en',
    DEFAULT_TRIGGER_KEY = 'none',
    IS_HISTORY_ENABLED_BY_DEFAULT = true,

    SAVE_STATUS = document.querySelector("#save-status"),

    SAVE_OPTIONS_BUTTON = document.querySelector("#save-btn"),
    
    RESET_OPTIONS_BUTTON = document.querySelector("#reset-btn");


function saveOptions(e) {
    language = document.querySelector("#language-selector").value;
    browser.storage.local.set({
        "language":language
    });
    console.log('language:'+language)

    e.preventDefault();
    
  }
  
  function restoreOptions() {
    let storageItem = browser.storage.local.get();

    storageItem.then((results) => {
        let language = results.language;
        // language
        document.querySelector("#language-selector").value = language || DEFAULT_LANGUAGE;
    });
  }

  function resetOptions (e) {
    browser.storage.local.set({
        language: DEFAULT_LANGUAGE,
        interaction: {
            dblClick: {
                key: DEFAULT_TRIGGER_KEY
            }
        },
        history: {
            enabled: IS_HISTORY_ENABLED_BY_DEFAULT
        }
    }).then(restoreOptions);

    e.preventDefault();
  }


  document.addEventListener('DOMContentLoaded', restoreOptions);

  SAVE_OPTIONS_BUTTON.addEventListener("click", saveOptions);
