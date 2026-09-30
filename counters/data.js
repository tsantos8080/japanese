  const tensDigitReading = {2:'に',3:'さん',4:'よん',5:'ご',6:'ろく',7:'なな',8:'はち',9:'きゅう'};

  // Generic composer: given a unitMap covering keys 1-9, 10, 100 (already fused with the
  // counter word, including any sound changes), builds the reading for any n in [1,100].
  function compose(n, unitMap){
    if(n === 100) return unitMap[100];
    const tens = Math.floor(n/10), ones = n % 10;
    if(tens === 0) return unitMap[ones];
    if(ones === 0){
      if(tens === 1) return unitMap[10];
      return tensDigitReading[tens] + unitMap[10];
    }
    if(tens === 1) return 'じゅう' + unitMap[ones];
    return tensDigitReading[tens] + 'じゅう' + unitMap[ones];
  }

  function regularUnitMap(suffix){
    return {1:'いち'+suffix,2:'に'+suffix,3:'さん'+suffix,4:'よん'+suffix,5:'ご'+suffix,
            6:'ろく'+suffix,7:'なな'+suffix,8:'はち'+suffix,9:'きゅう'+suffix,
            10:'じゅう'+suffix,100:'ひゃく'+suffix};
  }

  function dayReading(n){
    const wholeSpecial = {1:'いちにち',2:'ふつか',3:'みっか',4:'よっか',5:'いつか',6:'むいか',
                           7:'なのか',8:'ようか',9:'ここのか',10:'とおか'};
    if(n === 100) return 'ひゃくにち';
    if(n <= 10) return wholeSpecial[n];
    if(n === 20) return 'はつか';
    const tens = Math.floor(n/10), ones = n % 10;
    const tensReading = tens === 1 ? 'じゅう' : tensDigitReading[tens] + 'じゅう';
    if(ones === 0) return tensReading + 'にち';
    if(ones === 4) return tensReading + 'よっか';
    const digitReading = {1:'いち',2:'に',3:'さん',5:'ご',6:'ろく',7:'しち',8:'はち',9:'く'};
    return tensReading + digitReading[ones] + 'にち';
  }

  const jiTable = {
    1:'いちじ',2:'にじ',3:'さんじ',4:'よじ',5:'ごじ',6:'ろくじ',7:'しちじ',8:'はちじ',9:'くじ',10:'じゅうじ',
    11:'じゅういちじ',12:'じゅうにじ',13:'じゅうさんじ',14:'じゅうよじ',15:'じゅうごじ',16:'じゅうろくじ',
    17:'じゅうしちじ',18:'じゅうはちじ',19:'じゅうくじ',20:'にじゅうじ',21:'にじゅういちじ',
    22:'にじゅうにじ',23:'にじゅうさんじ',24:'にじゅうよじ'
  };

  function ninReading(n){
    if(n === 1) return 'ひとり';
    if(n === 2) return 'ふたり';
    const d = {1:'いち',2:'に',3:'さん',4:'よ',5:'ご',6:'ろく',7:'しち',8:'はち',9:'きゅう'};
    const unitMap = {1:d[1]+'にん',2:d[2]+'にん',3:d[3]+'にん',4:d[4]+'にん',5:d[5]+'にん',
                      6:d[6]+'にん',7:d[7]+'にん',8:d[8]+'にん',9:d[9]+'にん',10:'じゅうにん',100:'ひゃくにん'};
    return compose(n, unitMap);
  }

  function nenReading(n){
    const d = {1:'いち',2:'に',3:'さん',4:'よ',5:'ご',6:'ろく',7:'しち',8:'はち',9:'きゅう'};
    const unitMap = {1:d[1]+'ねん',2:d[2]+'ねん',3:d[3]+'ねん',4:d[4]+'ねん',5:d[5]+'ねん',
                      6:d[6]+'ねん',7:d[7]+'ねん',8:d[8]+'ねん',9:d[9]+'ねん',10:'じゅうねん',100:'ひゃくねん'};
    return compose(n, unitMap);
  }

  const tsuTable = {1:'ひとつ',2:'ふたつ',3:'みっつ',4:'よっつ',5:'いつつ',6:'むっつ',
                     7:'ななつ',8:'やっつ',9:'ここのつ',10:'とお'};

  // ---------- Counter definitions ----------

  const counters = [
    { id:'tsu', kanji:'', hira:'つ', romaji:'tsu', meaning:'Contador geral', min:1, max:10,
      reading:n => tsuTable[n],
      nouns:[['coisa','coisas'],['tarefa','tarefas'],['assunto','assuntos']] },

    { id:'ko', kanji:'個', hira:'こ', romaji:'ko', meaning:'Objetos pequenos', min:1, max:100,
      reading:n => compose(n, {1:'いっこ',2:'にこ',3:'さんこ',4:'よんこ',5:'ごこ',6:'ろっこ',
                                7:'ななこ',8:'はっこ',9:'きゅうこ',10:'じゅっこ',100:'ひゃっこ'}),
      nouns:[['maçã','maçãs'],['ovo','ovos'],['caixa','caixas'],['laranja','laranjas']] },

    { id:'satsu', kanji:'冊', hira:'さつ', romaji:'satsu', meaning:'Livros, cadernos', min:1, max:100,
      reading:n => compose(n, {1:'いっさつ',2:'にさつ',3:'さんさつ',4:'よんさつ',5:'ごさつ',6:'ろくさつ',
                                7:'ななさつ',8:'はっさつ',9:'きゅうさつ',10:'じゅっさつ',100:'ひゃくさつ'}),
      nouns:[['livro','livros'],['caderno','cadernos'],['revista','revistas']] },

    { id:'hai', kanji:'杯', hira:'はい', romaji:'hai', meaning:'Copos, xícaras', min:1, max:100,
      reading:n => compose(n, {1:'いっぱい',2:'にはい',3:'さんばい',4:'よんはい',5:'ごはい',6:'ろっぱい',
                                7:'ななはい',8:'はっぱい',9:'きゅうはい',10:'じゅっぱい',100:'ひゃっぱい'}),
      nouns:[['copo de suco','copos de suco'],['xícara de chá','xícaras de chá'],['tigela de sopa','tigelas de sopa']] },

    { id:'nichi', kanji:'日', hira:'にち', romaji:'nichi', meaning:'Dias (duração)', min:1, max:100,
      reading: dayReading,
      nouns:[['dia','dias']] },

    { id:'mai', kanji:'枚', hira:'まい', romaji:'mai', meaning:'Objetos planos e finos', min:1, max:100,
      reading:n => compose(n, regularUnitMap('まい')),
      nouns:[['folha de papel','folhas de papel'],['camisa','camisas'],['prato','pratos'],['cartão','cartões']] },

    { id:'ji', kanji:'時', hira:'じ', romaji:'ji', meaning:'Horas (relógio)', min:1, max:24,
      reading:n => jiTable[n],
      nouns:[['hora','horas']] },

    { id:'hon', kanji:'本', hira:'ほん', romaji:'hon', meaning:'Objetos longos e cilíndricos', min:1, max:100,
      reading:n => compose(n, {1:'いっぽん',2:'にほん',3:'さんぼん',4:'よんほん',5:'ごほん',6:'ろっぽん',
                                7:'ななほん',8:'はっぽん',9:'きゅうほん',10:'じゅっぽん',100:'ひゃっぽん'}),
      nouns:[['caneta','canetas'],['garrafa','garrafas'],['árvore','árvores'],['guarda-chuva','guarda-chuvas']] },

    { id:'dai', kanji:'台', hira:'だい', romaji:'dai', meaning:'Máquinas e veículos', min:1, max:100,
      reading:n => compose(n, regularUnitMap('だい')),
      nouns:[['carro','carros'],['computador','computadores'],['televisão','televisões']] },

    { id:'fun', kanji:'分', hira:'ふん', romaji:'fun', meaning:'Minutos', min:1, max:100,
      reading:n => compose(n, {1:'いっぷん',2:'にふん',3:'さんぷん',4:'よんぷん',5:'ごふん',6:'ろっぷん',
                                7:'ななふん',8:'はっぷん',9:'きゅうふん',10:'じゅっぷん',100:'ひゃっぷん'}),
      nouns:[['minuto','minutos']] },

    { id:'kagetsu', kanji:'ヶ月', hira:'かげつ', romaji:'kagetsu', meaning:'Meses (duração)', min:1, max:100,
      reading:n => compose(n, {1:'いっかげつ',2:'にかげつ',3:'さんかげつ',4:'よんかげつ',5:'ごかげつ',
                                6:'ろっかげつ',7:'ななかげつ',8:'はっかげつ',9:'きゅうかげつ',
                                10:'じゅっかげつ',100:'ひゃっかげつ'}),
      nouns:[['mês','meses']] },

    { id:'soku', kanji:'足', hira:'そく', romaji:'soku', meaning:'Pares de calçados', min:1, max:100,
      reading:n => compose(n, {1:'いっそく',2:'にそく',3:'さんぞく',4:'よんそく',5:'ごそく',6:'ろくそく',
                                7:'ななそく',8:'はっそく',9:'きゅうそく',10:'じゅっそく',100:'ひゃくそく'}),
      nouns:[['par de sapatos','pares de sapatos'],['par de meias','pares de meias'],['par de chinelos','pares de chinelos']] },

    { id:'nin', kanji:'人', hira:'にん', romaji:'nin', meaning:'Pessoas', min:1, max:100,
      reading: ninReading,
      nouns:[['pessoa','pessoas'],['aluno','alunos'],['amigo','amigos']] },

    { id:'hiki', kanji:'匹', hira:'ひき', romaji:'hiki', meaning:'Animais pequenos/médios', min:1, max:100,
      reading:n => compose(n, {1:'いっぴき',2:'にひき',3:'さんびき',4:'よんひき',5:'ごひき',6:'ろっぴき',
                                7:'ななひき',8:'はっぴき',9:'きゅうひき',10:'じゅっぴき',100:'ひゃっぴき'}),
      nouns:[['gato','gatos'],['cachorro','cachorros'],['peixe','peixes'],['inseto','insetos']] },

    { id:'nen', kanji:'年', hira:'ねん', romaji:'nen', meaning:'Anos (duração, não idade)', min:1, max:100,
      reading: nenReading,
      nouns:[['ano de estudo de japonês','anos de estudo de japonês'],
             ['ano morando no Rio','anos morando no Rio'],
             ['ano de experiência','anos de experiência'],
             ['ano de casamento','anos de casamento'],
             ['ano de espera','anos de espera']] },
  ];

