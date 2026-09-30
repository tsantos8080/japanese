  const KANA_MAP = {
    // Digraphs (Youon Hiragana)
    "きゃ": ["kya","kilya","kixya"], "きゅ": ["kyu","kilyu","kixyu"], "きょ": ["kyo","kilyo","kixyo"],
    "しゃ": ["sha","sya"], "しゅ": ["shu","syu"], "しょ": ["sho","syo"],
    "ちゃ": ["cha","tya","cya"], "ちゅ": ["chu","tyu","cyu"], "ちょ": ["cho","tyo","cyo"],
    "にゃ": ["nya"], "にゅ": ["nyu"], "にょ": ["nyo"],
    "ひゃ": ["hya"], "ひゅ": ["hyu"], "ひょ": ["hyo"],
    "みゃ": ["mya"], "みゅ": ["myu"], "みょ": ["myo"],
    "りゃ": ["rya"], "りゅ": ["ryu"], "りょ": ["ryo"],
    "ぎゃ": ["gya"], "ぎゅ": ["gyu"], "ぎょ": ["gyo"],
    "じゃ": ["ja","zya","jya"], "じゅ": ["ju","zyu","jyu"], "じょ": ["jo","zyo","jyo"],
    "びゃ": ["bya"], "びゅ": ["byu"], "びょ": ["byo"],
    "ぴゃ": ["pya"], "ぴゅ": ["pyu"], "ぴょ": ["pyo"],

    // Digraphs (Youon Katakana)
    "キャ": ["kya"], "キュ": ["kyu"], "キョ": ["kyo"],
    "シャ": ["sha","sya"], "シュ": ["shu","syu"], "ショ": ["sho","syo"],
    "チャ": ["cha","tya"], "チュ": ["chu","tyu"], "チョ": ["cho","tyo"],
    "ニャ": ["nya"], "ニュ": ["nyu"], "ニョ": ["nyo"],
    "ヒャ": ["hya"], "ヒュ": ["hyu"], "ヒョ": ["hyo"],
    "ミャ": ["mya"], "ミュ": ["myu"], "ミョ": ["myo"],
    "リャ": ["rya"], "リュ": ["ryu"], "リョ": ["ryo"],
    "ギャ": ["gya"], "ギュ": ["gyu"], "ギョ": ["gyo"],
    "ジャ": ["ja","zya","jya"], "ジュ": ["ju","zyu","jyu"], "ジョ": ["jo","zyo","jyo"],
    "ビャ": ["bya"], "ビュ": ["byu"], "ビョ": ["byo"],
    "ピャ": ["pya"], "ピュ": ["pyu"], "ピョ": ["pyo"],
    "ティ": ["ti","thi"], "ディ": ["di","dhi"],
    "ファ": ["fa"], "フィ": ["fi"], "フェ": ["fe"], "フォ": ["fo"],

    // Hiragana Singles
    "あ": ["a"], "い": ["i","yi"], "う": ["u","wu"], "え": ["e"], "お": ["o"],
    "か": ["ka","ca"], "き": ["ki"], "く": ["ku","cu","qu"], "け": ["ke"], "こ": ["ko","co"],
    "さ": ["sa"], "し": ["shi","si","ci"], "す": ["su"], "せ": ["se","ce"], "そ": ["so"],
    "た": ["ta"], "ち": ["chi","ti"], "つ": ["tsu","tu"], "て": ["te"], "と": ["to"],
    "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
    "は": ["ha","wa"], "ひ": ["hi"], "ふ": ["fu","hu"], "へ": ["he","e"], "ほ": ["ho"],
    "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
    "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
    "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
    "わ": ["wa"], "を": ["wo","o"], "ん": ["n","nn","xn"],
    "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
    "ざ": ["za"], "じ": ["ji","zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
    "だ": ["da"], "ぢ": ["di","ji"], "づ": ["du","zu"], "で": ["de"], "ど": ["do"],
    "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
    "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],

    // Katakana Singles
    "ア": ["a"], "イ": ["i"], "ウ": ["u"], "エ": ["e"], "オ": ["o"],
    "カ": ["ka"], "キ": ["ki"], "ク": ["ku"], "ケ": ["ke"], "コ": ["ko"],
    "サ": ["sa"], "シ": ["shi","si"], "ス": ["su"], "セ": ["se"], "ソ": ["so"],
    "タ": ["ta"], "チ": ["chi","ti"], "ツ": ["tsu","tu"], "テ": ["te"], "ト": ["to"],
    "ナ": ["na"], "ニ": ["ni"], "ヌ": ["nu"], "ネ": ["ne"], "ノ": ["no"],
    "ハ": ["ha","wa"], "ヒ": ["hi"], "フ": ["fu","hu"], "ヘ": ["he","e"], "ホ": ["ho"],
    "マ": ["ma"], "ミ": ["mi"], "ム": ["mu"], "メ": ["me"], "モ": ["mo"],
    "ヤ": ["ya"], "ユ": ["yu"], "ヨ": ["yo"],
    "ラ": ["ra"], "リ": ["ri"], "ル": ["ru"], "レ": ["re"], "ロ": ["ro"],
    "ワ": ["wa"], "ヲ": ["wo","o"], "ン": ["n","nn","xn"],
    "ガ": ["ga"], "ギ": ["gi"], "グ": ["gu"], "ゲ": ["ge"], "ゴ": ["go"],
    "ザ": ["za"], "ジ": ["ji","zi"], "ず": ["zu"], "ぜ": ["ze"], "ゾ": ["zo"],
    "ダ": ["da"], "ヂ": ["di","ji"], "ヅ": ["du","zu"], "デ": ["de"], "ド": ["do"],
    "バ": ["ba"], "ビ": ["bi"], "ブ": ["bu"], "ベ": ["be"], "ボ": ["bo"],
    "パ": ["pa"], "ピ": ["pi"], "プ": ["pu"], "ペ": ["pe"], "ポ": ["po"],
    "ー": ["-","^"],
    "、": [","], "。": ["."], "！": ["!"], "？": ["?"], " ": [" "], "　": [" "]
  };

  // Parses a full Kana sentence into syllabic chunks with valid romaji options
  function parseKanaSentence(sentence){
    const chunks = [];
    let i = 0;
    while(i < sentence.length){
      // Sokuon (small tsu / っ / ッ)
      if(sentence[i] === 'っ' || sentence[i] === 'ッ'){
        const nextPair = sentence.slice(i+1, i+3);
        const nextSingle = sentence[i+1];
        const nextRomajiList = KANA_MAP[nextPair] || KANA_MAP[nextSingle] || ['t'];
        const sokuonChar = nextRomajiList[0] ? nextRomajiList[0][0] : 't';
        chunks.push({
          kana: sentence[i],
          romaji: [sokuonChar, 'xtsu', 'ltsu', 'xtu', 'ltu']
        });
        i++;
        continue;
      }

      // Digraph (youon 2 chars)
      const pair = sentence.slice(i, i+2);
      if(KANA_MAP[pair]){
        chunks.push({
          kana: pair,
          romaji: KANA_MAP[pair]
        });
        i += 2;
        continue;
      }

      // Single character
      const single = sentence[i];
      chunks.push({
        kana: single,
        romaji: KANA_MAP[single] || [single]
      });
      i++;
    }
    return chunks;
  }

  // ---------- Phrase Database (Mock) ----------

  const PHRASES = [
    // Hiragana
    {
      id: 1,
      type: "hiragana",
      kana: "きょうはいいてんきですね",
      meaning: "Hoje o tempo está bom, né?"
    },
    {
      id: 2,
      type: "hiragana",
      kana: "はじめまして、よろしくおねがいします",
      meaning: "Muito prazer em conhecê-lo."
    },
    {
      id: 3,
      type: "hiragana",
      kana: "あしたはともだちにあいます",
      meaning: "Amanhã vou encontrar um amigo."
    },
    {
      id: 4,
      type: "hiragana",
      kana: "にほんごのべんきょうはたのしいです",
      meaning: "Estudar japonês é muito divertido."
    },
    {
      id: 5,
      type: "hiragana",
      kana: "すみません、いまなんじですか",
      meaning: "Com licença, que horas são agora?"
    },
    {
      id: 6,
      type: "hiragana",
      kana: "まいあさしちじにおきます",
      meaning: "Acordo todos os dias às sete horas."
    },
    {
      id: 7,
      type: "hiragana",
      kana: "がっこうへあるいていきます",
      meaning: "Vou a pé para a escola."
    },

    // Katakana
    {
      id: 8,
      type: "katakana",
      kana: "コーヒーをのみます",
      meaning: "Bebo café."
    },
    {
      id: 9,
      type: "katakana",
      kana: "アイスクリームがおいしいです",
      meaning: "O sorvete está uma delícia."
    },
    {
      id: 10,
      type: "katakana",
      kana: "レストランでピザをたべました",
      meaning: "Comi pizza no restaurante."
    },
    {
      id: 11,
      type: "katakana",
      kana: "スーパーでパンをかいます",
      meaning: "Compro pão no supermercado."
    },
    {
      id: 12,
      type: "katakana",
      kana: "ホテルはどこにありますか",
      meaning: "Onde fica o hotel?"
    },
    {
      id: 13,
      type: "katakana",
      kana: "ノートパソコンをつかいます",
      meaning: "Uso o computador portátil."
    },
    {
      id: 14,
      type: "katakana",
      kana: "タクシーでいきます",
      meaning: "Vou de táxi."
    },

    // Mixed
    {
      id: 15,
      type: "mixed",
      kana: "デパートでシャツをかいました",
      meaning: "Comprei uma camisa na loja de departamentos."
    },
    {
      id: 16,
      type: "mixed",
      kana: "スマホでしゃしんをとります",
      meaning: "Tiro fotos com o smartphone."
    },
    {
      id: 17,
      type: "mixed",
      kana: "テレビでアニメをみました",
      meaning: "Assisti anime na televisão."
    },
    {
      id: 18,
      type: "mixed",
      kana: "コンビニでおにぎりをかいます",
      meaning: "Compro onigiri na loja de conveniência."
    },
    {
      id: 19,
      type: "mixed",
      kana: "バスでがっこうへいきます",
      meaning: "Vou para a escola de ônibus."
    },
    {
      id: 20,
      type: "mixed",
      kana: "カフェでジュースをのみました",
      meaning: "Bebi suco na cafeteria."
    }
  ];

