// =============================================
// honeynet.js
// Purpose: HoneyNet search shell + keyword-typed
// results. Add new keywords to honeyData — no
// other code changes needed for simple types.
// =============================================

const honeyData = {
    banana: {
        type: 'quip',
        text: "🍌 just a banana bruh. that's it. that's the search.",
    },
    music: {
        type: 'redirect',
        title: "Ahone's Music Player",
        description: "A lil compilation of my favorite tunes. Click the button below to open it up.",
        windowId: 'window-music',
        buttonLabel: 'Open Music Player →',
    },
    ahoneos: {
        type: 'meta',
        text: "You're in the search result. Just know I'm rolling my eyes at you",
    },
    nothing: {
        type: 'interactive',
        variant: 'tumbleweed',
    },
    existentialism: {
        type: 'longform',
        title: 'On Existentialism (a placeholder)',
        body: [
            "This is a placeholder paragraph. Replace this with your real reflection whenever you're ready.",
            "The body field is just an array of strings — each string becomes its own paragraph, same pattern as everywhere else in AhoneOS.",
            "No character limit, no rules — write however long or short feels right for this particular keyword.",
        ],
    },
    google: {
        type: 'meta',
        text: "Google? I hate to say it; hope I don't sound ridiculous : I don't know who this man is. I mean he could be walking down the street and I wouldn't know a thang. Sorry to this man."
    },
    'hire me': {
        type: 'quip',
        text: "😭 currently accepting: job offers, free money, and emotional support.",
    },
    help: {
        type: 'meta',
        text: "...no *smirk*. you can do this yourself, diva.",
    },
    why: {
        type: 'quip',
        text: "great question. when you figure it out, let me know.",
    },
    money: {
        type: 'quip',
        text: "404: cash not found.",
    },
    networth: {
        type: 'quip',
        text: "who asking? you tryna contribute to it? 👀",
    },
    sleep: {
        type: 'meta',
        text: "You should be doing that instead of searching this.",
    },
    love: {
        type: 'quip',
        text: "a beautifully engineered chemical malfunction. you ain't finding it here tho.",
    },
    school: {
        type: 'redirect',
        title: 'Academic Projects',
        description: 'I suffered so you don\'t have to. Proof enclosed.',
        windowId: 'window-academic',
        buttonLabel: 'View Academic Projects →',
    },
    animals: {
        type: 'redirect',
        title: 'Favorites',
        description: 'The corkboard knows things.',
        windowId: 'window-favorites',
        buttonLabel: 'Open Favorites →',
    },
    fashion: {
        type: 'redirect',
        title: 'Favorites',
        description: 'Visual inspiration, pinned and unhinged.',
        windowId: 'window-favorites',
        buttonLabel: 'Open Favorites →',
    },
    anime: {
        type: 'tierlist',
    },
    deadline: {
        type: 'interactive',
        variant: 'deadline',
    },
    procrastination: {
        type: 'interactive',
        variant: 'loading',
    },
    lazy: {
        type: 'interactive',
        variant: 'loading',
    },
};

    // Fallback jokes shown when the searched word isn't in honeyData
    const fallbackResults = [
        {
            title: 'Result not found, want a cookie instead?',
            desc: 'HoneyNet searched high and low and found absolutely nothing useful...typical.',
        },
        {
            title: 'Did you mean: literally anything else?',
            desc: 'This query returned 0 results. Ion know gng.',
        },
        {
            title: 'The hive has no honey for this one...get it? because it\'s HoneyNet? ...I\'ll see myself out.',
            desc: 'Try a different word, or not. Up to you.',
        },
    ];

    // Tier order matters — this array controls what displays top to bottom,
    // best to worst. Each anime entry below references a tier by its `key`.
    const tierDefinitions = [
        { key: 'masterpiece', label: '🏆 cinematic masterpiece' },
        { key: 'loved', label: '💗 loved it' },
        { key: 'aight', label: '🤷 aight' },
        { key: 'boring', label: '😴 boring' },
        { key: 'doody', label: '💩 straight up doody' },
    ];

    const animeData = {
        anime_1: {
            title: 'Kakushigoto',
            tier: 'boring',
            thoughts: 'fell asleep halfway through the first episode',
        },
        anime_2: {
            title: 'The place promised in our early days',
            tier: 'loved',
            thoughts: 'beautifully animated.the story was a bit confusing but ultimately satisfying. it reminded me of "your name".',
        },
        anime_3: {
            title: 'A whisker away',
            tier: 'loved',
            thoughts: 'adorable!',
        },
        anime_4: {
            title: 'Boogiepop phantom',
            tier: 'aight',
            thoughts: 'huh?!',
        },
        anime_5: {
            title: 'Tales of zestiria the x',
            tier: 'doody',
            thoughts: 'shit story, shit animation, shit everything. i regret watching this.',
        },
        anime_6: {
            title: 'My hero academia',
            tier: 'masterpiece',
            thoughts: 'I understand the hype...',
        },
        anime_7: {
            title: 'Hell\'s Paradise',
            tier: 'loved',
            thoughts: 'so entertaining! it\'s final boss after final boss.',
        },
        anime_8: {
            title: 'Your name',
            tier: 'masterpiece',
            thoughts: 'ifkyky',
        },
        anime_9: {
            title: 'Chainsaw man',
            tier: 'loved',
            thoughts: 'can\'t wait for the next season.',
        },
        anime_10: {
            title: 'Made in abyss',
            tier: 'loved',
            thoughts: 'haunting and beautiful. a lil weird sometimes but amazing nontheless.',
        },
        anime_11: {
            title: 'Fullmetal alchemist: brotherhood',
            tier: 'masterpiece',
            thoughts: 'a classic. the story is so well written and the characters are so well developed.',
        },
        anime_12: {
            title: 'Buddy daddies',
            tier: 'loved',
            thoughts: 'so fun and entertaining.',
        },
        anime_13: {
            title: 'Makeine : too many losing heroines',
            tier: 'aight',
            thoughts: 'decent concept but the writing was boring and unremarkable.',
        },
        anime_14: {
            title: 'Deadman wonderland',
            tier: 'loved',
            thoughts: 'so sad it got cancelled. very original concept and fun to watch.',
        },
        anime_15: {
            title: 'UQ holder',
            tier: 'doody',
            thoughts: 'I wish I could bleach my brain of this nonesense',
        },
        anime_16: {
            title: 'Bleach',
            tier: 'loved',
            thoughts: 'simply amazing',
        },
        anime_17: {
            title: 'Ride your wave',
            tier: 'loved',
            thoughts: 'stunning...no notes',
        },
        anime_18: {
            title: 'Gachiakuta',
            tier: 'loved',
            thoughts: 'for a new gen, this is terrific',
        },
        anime_19: {
            title: 'The apothecary diaries',
            tier: 'masterpiece',
            thoughts: 'intrigue and romance...my faves',
        },
        anime_20: {
            title: 'The promised neverland',
            tier: 'aight',
            thoughts: 'amazing concept but s2 ruined it',
        },
        anime_21: {
            title: 'A silent voice',
            tier: 'loved',
            thoughts: 'never forgive your bullies ppl',
        },
        anime_22: {
            title: 'Beastars',
            tier: 'boring',
            thoughts: 'not sure what I watched. the storyline was good enough...it roped me in. I was literally in a trance watching this...weird ahh anime',
        },
        anime_23: {
            title: 'Solo leveling',
            tier: 'boring',
            thoughts: 'snooze fest. the story is so ass but animation saved it',
        },
        anime_24: {
            title: 'Howl\'s moving castle',
            tier: 'aight',
            thoughts: 'not bad...but not great either',
        },
        anime_25: {
            title: 'Kuroko no basket',
            tier: 'aight',
            thoughts: 'not a fan of sports anime but this was decent.',
        },
        anime_26: {
            title: 'Food wars',
            tier: 'doody',
            thoughts: 'gooner anime',
        },
        anime_27: {
            title: 'Kaguya sama : love is war',
            tier: 'loved',
            thoughts: 'hilarious',
        },
        anime_28: {
            title: 'Tokyo ghoul',
            tier: 'boring',
            thoughts: 'dnf; s1 was cool then re spoiled the whole thing',
        },
        anime_29: {
            title: 'Jujutsu kaisen',
            tier: 'loved',
            thoughts: 'haters gon hate but this is solid stuff',
        },
        anime_30: {
            title: 'Spy x Family',
            tier: 'loved',
            thoughts: 'love Anya down',
        },
        anime_31: {
            title: 'Noragami',
            tier: 'aight',
            thoughts: 'no thoughts...entertaining enough',
        },
        anime_32: {
            title: 'Summertime rendering',
            tier: 'loved',
            thoughts: 'why is no one talking about this?',
        },
        anime_33: {
            title: 'Violet evergarden',
            tier: 'aight',
            thoughts: 'cool story...weird ass characters. noncy behavior',
        },
        anime_34: {
            title: 'Kabaneri of the iron fortress',
            tier: 'boring',
            thoughts: 'lame af. tryna be AOT but failed.',
        },
        anime_35: {
            title: 'Mushoku tensei',
            tier: 'doody',
            thoughts: 'DNF cuz it\'s creepy. jail for the writers...immediately',
        },
        anime_36: {
            title: 'Mob psycho 100',
            tier: 'loved',
            thoughts: 'art style is so dope',
        },
        anime_37: {
            title: 'God eater',
            tier: 'boring',
            thoughts: 'very forgetable',
        },
        anime_38: {
            title: 'Soul eater',
            tier: 'masterpiece',
            thoughts: 'loved every second of it',
        },
        anime_39: {
            title: 'Naruto',
            tier: 'masterpiece',
            thoughts: 'favorite anime oat',
        },
        anime_40: {
            title: 'Fairy tail',
            tier: 'loved',
            thoughts: 'funny, captivating, amazing sountrack...',
        },
        anime_41: {
            title: 'Cyberpunk edgerunners',
            tier: 'boring',
            thoughts: 'didn\'t get the hype',
        },
        anime_42: {
            title: 'Seven deadly sins',
            tier: 'aight',
            thoughts: 'weirdo characters but cool fights',
        },
        anime_43: {
            title: 'Sakamoto days',
            tier: 'aight',
            thoughts: 'nothing to write home about',
        },
        anime_44: {
            title: 'Dr stone',
            tier: 'masterpiece',
            thoughts: 'senku is my fave MC ever. y\'all not getting it',
        },
        anime_45: {
            title: 'Mashle : magic and muscles',
            tier: 'aight',
            thoughts: 'not bad',
        },
        anime_46: {
            title: 'Black clover',
            tier: 'aight',
            thoughts: 'annoying MCs...genuinely despise yuno',
        },
        anime_47: {
            title: 'Vinland saga',
            tier: 'masterpiece',
            thoughts: 'just watch it...',
        },
        anime_48: {
            title: 'Demon slayer',
            tier: 'loved',
            thoughts: 'I don\'t get the hate',
        },
        anime_49: {
            title: 'Attack on titan',
            tier: 'masterpiece',
            thoughts: 'best anime ever.',
        },
        anime_50: {
            title: 'Hunter x Hunter',
            tier: 'masterpiece',
            thoughts: 'chef\'s kiss fr',
        },
        anime_51: {
            title: 'Dan da dan',
            tier: 'loved',
            thoughts: 'good but I\' never recommend it',
        },
        anime_52: {
            title: 'The disatrous life of Saiki K',
            tier: 'loved',
            thoughts: 'top 10 funniest animes ever',
        },
        anime_53: {
            title: 'Kaiju no 8',
            tier: 'loved',
            thoughts: 'unexpectedly good',
        },
        anime_54: {
            title: 'One punch man',
            tier: 'aight',
            thoughts: 'bro tryna be All Might',
        }
    };

    // Each entry's `keyword` should match a real key in honeyData,
    // so clicking a trending item actually triggers that result.
    const trendingList = [
    { keyword: 'deadline', label: '"deadline"', tag: 'panic searches up 340%', spike: '🔺' },
    { keyword: 'money', label: '"money"', tag: 'a universal experience', spike: '🔺' },
    { keyword: 'anime', label: '"anime"', tag: 'the tier list everyone asked for', spike: '🔺' },
    { keyword: 'existentialism', label: '"existentialism"', tag: '3am thoughts, catalogued', spike: '🔺' },
    { keyword: 'banana', label: '"banana"', tag: 'inexplicably popular', spike: '🔺' },
    ];

    function initHoneyNet(container) {
        const homeLayer = container.querySelector('#honeyHomeLayer');
        const resultsLayer = container.querySelector('#honeyResultsLayer');
        const input = container.querySelector('#honeyInput');
        const searchBtn = container.querySelector('#honeySearchBtn');
        const luckyBtn = container.querySelector('#honeyLuckyBtn');
        const backBtn = container.querySelector('#honeyBackBtn');
        const resultsHeader = container.querySelector('#honeyResultsHeader');
        const resultsBody = container.querySelector('#honeyResultsBody');
        const cookieModal = container.querySelector('#cookieModal');
        const cookieAccept = container.querySelector('#cookieAccept');
        const cookieDecline = container.querySelector('#cookieDecline');
        const cookieRain = container.querySelector('#cookieRain');
        const tierDetailModal = container.querySelector('#tierDetailModal');
        const tierDetailTitle = container.querySelector('#tierDetailTitle');
        const tierDetailBody = container.querySelector('#tierDetailBody');
        const tierDetailClose = container.querySelector('#tierDetailClose');
        let activeTimers = [];

        tierDetailClose.addEventListener('click', function() {
            tierDetailModal.classList.remove('visible');
        });

        tierDetailModal.addEventListener('click', function(e) {
            if (e.target === tierDetailModal) tierDetailModal.classList.remove('visible');
        });

        const stickyNotes = container.querySelectorAll('.sticky-note');
        stickyNotes.forEach(function(note) {
            note.addEventListener('click', function() {
                const keyword = note.dataset.keyword;
                input.value = keyword;
                performSearch(keyword);
            });
        });

        function renderTierList() {
        const wrapper = document.createElement('div');

                tierDefinitions.forEach(function(tierDef) {
                    // Find every anime that belongs to this tier
                    const itemsInTier = Object.entries(animeData).filter(
                    ([id, anime]) => anime.tier === tierDef.key
                    );

                    const row = document.createElement('div');
                    row.className = 'tier-row tier-' + tierDef.key;

                    const itemsHtml = itemsInTier.length
                    ? itemsInTier.map(([id, anime]) =>
                        `<button class="tier-item-btn" data-anime-id="${id}">${anime.title}</button>`
                        ).join('')
                    : `<span class="tier-empty">nothing here yet</span>`;

                    row.innerHTML = `
                    <span class="tier-label">${tierDef.label}</span>
                    <div class="tier-items">${itemsHtml}</div>
                    `;

                    wrapper.appendChild(row);
                });

            resultsBody.appendChild(wrapper);

            // Wire up every title button to open its detail card
            wrapper.querySelectorAll('.tier-item-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                const anime = animeData[btn.dataset.animeId];
                if (!anime) return;
                tierDetailTitle.textContent = anime.title;
                tierDetailBody.textContent = anime.thoughts;
                tierDetailModal.classList.add('visible');
                });
            });
        }

        cookieAccept.addEventListener('click', function() {
            cookieModal.classList.remove('visible');
            rainCookies();
        });

        cookieDecline.addEventListener('click', function() {
            cookieModal.classList.remove('visible');
            showCookieDeclineMessage();
        });

        function rainCookies() {
            for (let i = 0; i < 25; i++) {
                const cookie = document.createElement('div');
                cookie.className = 'falling-cookie';
                cookie.textContent = '🍪';
                cookie.style.left = Math.random() * 100 + '%';
                cookie.style.animationDuration = (2 + Math.random() * 1.5) + 's';
                cookie.style.animationDelay = (Math.random() * 0.5) + 's';
                cookieRain.appendChild(cookie);
                cookie.addEventListener('animationend', function() {
                cookie.remove(); // cleans itself up, no leftover invisible elements piling up
                });
            }
        }

        function showCookieDeclineMessage() {
            const msg = document.createElement('div');
            msg.className = 'cookie-decline-toast';
            msg.textContent = "your loss 🙄";
            container.appendChild(msg);
            setTimeout(function() {
                msg.remove();
            }, 2200);
        }

        function clearActiveTimers() {
            activeTimers.forEach(function(id) {
                clearInterval(id); // clearInterval also safely clears timeouts, so one call handles both
            });
            activeTimers = [];
        }

        function goHome() {
            clearActiveTimers();
            resultsLayer.classList.add('hidden');
            homeLayer.classList.remove('hidden');
            input.value = '';
        }
        backBtn.addEventListener('click', goHome);

        function findMatchingKeyword(rawQuery) {
            const query = rawQuery.trim().toLowerCase();
            if (!query) return null;

            if (honeyData[query]) return query; // exact match, fastest path

            // Check if any keyword appears as a whole word inside the query —
            // sorted longest-first so specific multi-word keys win over short ones.
            const keys = Object.keys(honeyData).sort((a, b) => b.length - a.length);
            for (const key of keys) {
                const pattern = new RegExp('\\b' + key + '\\b', 'i');
                if (pattern.test(query)) return key;
            }
            return null;
        }

        function performSearch(rawQuery) {
            const query = rawQuery.trim().toLowerCase();
            if (!query) return;

            resultsHeader.textContent = `🍯 results for "${rawQuery.trim()}"`;
            resultsBody.innerHTML = '';

            // Show the results layer FIRST, so anything we render next
            // (like measuring the tumbleweed stage's width) sees real,
            // laid-out dimensions instead of a hidden 0×0 box.
            homeLayer.classList.add('hidden');
            resultsLayer.classList.remove('hidden');
            
            const matchedKey = findMatchingKeyword(query);
            const entry = matchedKey ? honeyData[matchedKey] : null;


            if (!entry) {
                renderFallback(rawQuery);
            } else if (entry.type === 'quip') {
                renderQuip(entry);
            } else if (entry.type === 'redirect') {
                renderRedirect(entry);
            } else if (entry.type === 'meta') {
                renderMeta(entry);
            } else if (entry.type === 'interactive' && entry.variant === 'tumbleweed') {
                renderTumbleweed();
            } else if (entry.type === 'longform') {
                renderLongform(entry);
            } else if (entry.type === 'tierlist') {
                renderTierList();
            } else if (entry.type === 'interactive' && entry.variant === 'deadline') {
                renderDeadline();
            } else if (entry.type === 'interactive' && entry.variant === 'loading') {
                renderFakeLoading();
            }
        }

        function renderFallback(query) {
            fallbackResults.forEach(function(r, index) {
                const card = document.createElement('div');
                card.className = 'honey-result-card';

                if (index === 0) {
                card.innerHTML = `
                    <button class="honey-result-title honey-cookie-trigger" id="cookieTriggerBtn">${r.title}</button>
                    <div class="honey-result-desc">${r.desc}</div>
                `;
                } else {
                card.innerHTML = `
                    <div class="honey-result-title">${r.title}</div>
                    <div class="honey-result-desc">${r.desc}</div>
                `;
                }
                resultsBody.appendChild(card);
            });

            const cookieTrigger = resultsBody.querySelector('#cookieTriggerBtn');
            if (cookieTrigger) {
                cookieTrigger.addEventListener('click', function() {
                cookieModal.classList.add('visible');
                });
            }
        }

        function renderQuip(entry) {
            const div = document.createElement('div');
            div.className = 'honey-quip';
            div.textContent = entry.text;
            resultsBody.appendChild(div);
        }

        function renderRedirect(entry) {
            const card = document.createElement('div');
            card.className = 'honey-redirect-card';
            card.innerHTML = `
            <div class="honey-redirect-title">${entry.title}</div>
            <div class="honey-redirect-desc">${entry.description}</div>
            <button class="honey-btn" id="honeyRedirectBtn">${entry.buttonLabel}</button>
            `;
            resultsBody.appendChild(card);

            card.querySelector('#honeyRedirectBtn').addEventListener('click', function() {
            openWindow(entry.windowId); // global function from windows.js
            });
        }

        function renderMeta(entry) {
            const div = document.createElement('div');
            div.className = 'honey-meta-card';
            div.textContent = entry.text;
            resultsBody.appendChild(div);
        }

        function renderTumbleweed() {
            const stage = document.createElement('div');
            stage.className = 'honey-interactive-stage';
            stage.innerHTML = `
                <div class="tumbleweed-reveal">what did you expect?</div>
                <img src="assets/images/honeynet/tumbleweed.png" class="tumbleweed-img" id="tumbleweedImg" alt="">
            `;
            resultsBody.appendChild(stage);

            const img = stage.querySelector('#tumbleweedImg');
            const weedWidth = 70;
            const rollDistance = stage.offsetWidth + weedWidth + 40;
            img.style.setProperty('--roll-distance', rollDistance + 'px');
        }

        function renderDeadline() {
            const stage = document.createElement('div');
            stage.className = 'honey-deadline-stage';
            stage.innerHTML = `
                <div class="deadline-message" id="deadlineMessage">something really horrible is about to happen in...</div>
                <div class="deadline-number" id="deadlineNumber">10</div>
                <div class="deadline-punchline" id="deadlinePunchline">jk...wanna be fwends?</div>
            `;
            resultsBody.appendChild(stage);

            const numberEl = stage.querySelector('#deadlineNumber');
            const punchlineEl = stage.querySelector('#deadlinePunchline');

            let secondsLeft = 10;

            const countdownInterval = setInterval(function() {
                secondsLeft--;

                if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                numberEl.style.display = 'none';
                stage.style.animation = 'none'; // stop the red flashing once it's over
                stage.style.background = '#1a0000';
                punchlineEl.classList.add('visible');
                return;
                }

                numberEl.textContent = secondsLeft;

                // Quick pulse animation on every tick, for a bit of urgency
                numberEl.classList.add('pulse');
                setTimeout(function() {
                numberEl.classList.remove('pulse');
                }, 150);

            }, 1000);
            activeTimers.push(countdownInterval);  
        }

        function renderFakeLoading() {
            const stage = document.createElement('div');
            stage.className = 'honey-loading-stage';
            stage.innerHTML = `
                <div class="loading-bar-track">
                <div class="loading-bar-fill" id="loadingFill"></div>
                </div>
                <div class="loading-percent" id="loadingPercent">0%</div>
                <div class="loading-status" id="loadingStatus"></div>
            `;
            resultsBody.appendChild(stage);

            const fillEl = stage.querySelector('#loadingFill');
            const percentEl = stage.querySelector('#loadingPercent');
            const statusEl = stage.querySelector('#loadingStatus');

            let percent = 0;

            // Climbs toward 97%, then resets back down and starts climbing
            // again — it LOOKS like it's about to finish, but genuinely never does.
            const loadingInterval = setInterval(function() {
                percent += Math.random() * 8;

                if (percent >= 97) {
                percent = 0; // the "never actually finishes" moment
                }

                fillEl.style.width = percent + '%';
                percentEl.textContent = Math.floor(percent) + '%';
            }, 400);
            activeTimers.push(loadingInterval);

            // First message, after enough time that it starts to feel suspicious
            const statusTimeout1 = setTimeout(function() {
                statusEl.textContent = 'still here?';
                statusEl.classList.add('visible');
            }, 13000);
            activeTimers.push(statusTimeout1);

            // The actual punchline, a beat later
            const statusTimeout2 = setTimeout(function() {
                statusEl.classList.remove('visible');
                setTimeout(function() {
                statusEl.textContent = "yeah, it's not gon load...go do the thing you're avoiding.";
                statusEl.classList.add('visible');
                }, 600);
            }, 19000);
            activeTimers.push(statusTimeout2);
        }

        function renderLongform(entry) {
            const card = document.createElement('div');
            card.className = 'honey-longform-card';

            const paragraphsHtml = entry.body.map(p => `<p>${p}</p>`).join('');

            card.innerHTML = `
                <div class="honey-longform-title">${entry.title}</div>
                <div class="honey-longform-body">${paragraphsHtml}</div>
            `;
            resultsBody.appendChild(card);
        }

        const trendingLink = container.querySelector('#honeyTrendingLink');

        trendingLink.addEventListener('click', function() {
        resultsHeader.textContent = `🔥 trending in the ahone universe`;
        resultsBody.innerHTML = '';

        const list = document.createElement('div');
        list.className = 'trending-list';

        trendingList.forEach(function(item, index) {
            const row = document.createElement('button');
            row.className = 'trending-row';
            row.innerHTML = `
            <span class="trending-rank">${index + 1}</span>
            <span class="trending-info">
                <div class="trending-term">${item.label}</div>
                <div class="trending-tag">${item.tag}</div>
            </span>
            <span class="trending-spike">${item.spike}</span>
            `;
            row.addEventListener('click', function() {
                input.value = item.keyword;
                performSearch(item.keyword);
            });
            list.appendChild(row);
        });

        resultsBody.appendChild(list);

        homeLayer.classList.add('hidden');
        resultsLayer.classList.remove('hidden');

    });

  // --- Wire up search triggers ---
  searchBtn.addEventListener('click', function() {
    performSearch(input.value);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') performSearch(input.value);
  });

  luckyBtn.addEventListener('click', function() {
    const keys = Object.keys(honeyData);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    input.value = randomKey;
    performSearch(randomKey);
  });

    const rainMuteBtn = container.querySelector('#rainMuteBtn');
    let isRainOn = true;

    rainMuteBtn.addEventListener('click', function() {
    if (isRainOn) {
        window.stopHoneyNetRain();
        rainMuteBtn.textContent = '☀️';
    } else {
        window.startHoneyNetRain();
        rainMuteBtn.textContent = '🌧️';
    }
    isRainOn = !isRainOn;
    });
}

let rainInterval = null;

function startHoneyNetRain() {
  const audio = document.getElementById('rainAudio');
  const visual = document.getElementById('rainVisual');
  const muteBtn = document.getElementById('rainMuteBtn');
  if (!audio || !visual) return;

  audio.volume = 0.5;
  audio.play().catch(function() {
    // If this ever fails, it just means the click gesture didn't
    // register as "real" to the browser — safe to ignore visually.
  });

  visual.classList.add('active');
  muteBtn.classList.remove('hidden');

  // Continuously spawn raindrop elements while active
    rainInterval = setInterval(function() {
        for (let i = 0; i < 3; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (0.5 + Math.random() * 0.3) + 's';
            visual.appendChild(drop);
            setTimeout(function() { drop.remove(); }, 1000);
        }
    }, 45);
}

function stopHoneyNetRain() {
  const audio = document.getElementById('rainAudio');
  const visual = document.getElementById('rainVisual');
  if (!audio || !visual) return;

  audio.pause();
  audio.currentTime = 0;
  visual.classList.remove('active');

  // Only remove the raindrops — NOT the whole container's contents,
  // since the cloud <img> tags live permanently in the HTML and
  // aren't meant to be deleted, just hidden via the 'active' class.
  visual.querySelectorAll('.raindrop').forEach(function(drop) {
    drop.remove();
  });

  if (rainInterval) {
    clearInterval(rainInterval);
    rainInterval = null;
  }
}

window.startHoneyNetRain = startHoneyNetRain;
window.stopHoneyNetRain = stopHoneyNetRain;