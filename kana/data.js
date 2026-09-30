const KANA = [];
function kanaEntry(hira, romaji, group, note = '', example = '') {
  const kata = [...hira].map(c => c >= 'ぁ' && c <= 'ゖ' ? String.fromCharCode(c.charCodeAt(0)+0x60) : c).join('');
  KANA.push({hira,kata,romaji,group,note,example});
}
const BASIC_ROWS = [
 ['あいうえお',['a','i','u','e','o']], ['かきくけこ',['ka','ki','ku','ke','ko']],
 ['さしすせそ',['sa','shi','su','se','so']], ['たちつてと',['ta','chi','tsu','te','to']],
 ['なにぬねの',['na','ni','nu','ne','no']], ['はひふへほ',['ha','hi','fu','he','ho']],
 ['まみむめも',['ma','mi','mu','me','mo']], ['や ゆ よ',['ya','','yu','','yo']],
 ['らりるれろ',['ra','ri','ru','re','ro']], ['わ   を',['wa','','','','wo']], ['ん',['n']]
];
const notes = {shi:'Em Hepburn, し é escrito shi.',chi:'Em Hepburn, ち é escrito chi.',tsu:'Não confunda つ com o pequeno っ.',fu:'Em Hepburn, ふ é escrito fu.',ha:'Como partícula, は é pronunciado wa.',he:'Como partícula, へ é pronunciado e.',wo:'を é pronunciado o quando usado como partícula de objeto.',n:'ん representa uma mora nasal. Não confunda com な・に・ぬ・ね・の.'};
const examples = {a:'朝 (あさ) — manhã',i:'犬 (いぬ) — cão',u:'海 (うみ) — mar',e:'駅 (えき) — estação',o:'お茶 (おちゃ) — chá',ka:'傘 (かさ) — guarda-chuva',ki:'木 (き) — árvore',shi:'白 (しろ) — branco',chi:'地図 (ちず) — mapa',tsu:'月 (つき) — lua',fu:'冬 (ふゆ) — inverno',n:'本 (ほん) — livro'};
BASIC_ROWS.forEach(([row,sounds])=>[...row].forEach((h,i)=>{if(h!==' ')kanaEntry(h,sounds[i],'gojuon',notes[sounds[i]]||'Leia o caractere com sua vogal; compare as duas escritas.',examples[sounds[i]]||'');}));
[['がぎぐげご',['ga','gi','gu','ge','go']],['ざじずぜぞ',['za','ji','zu','ze','zo']],['だぢづでど',['da','ji','zu','de','do']],['ばびぶべぼ',['ba','bi','bu','be','bo']],['ぱぴぷぺぽ',['pa','pi','pu','pe','po']]].forEach(([row,sounds])=>[...row].forEach((h,i)=>kanaEntry(h,sounds[i],'dakuon',h==='ぢ'||h==='づ'?'Na pronúncia padrão, corresponde a じ ou ず; a grafia depende da palavra. Use di/du para distinguir na digitação.':h>='ぱ'&&'ぱぴぷぺぽ'.includes(h)?'O círculo ゜ é o handakuten.':'Os dois sinais ゛ são o dakuten.')));
[['き','ky'],['し','sh'],['ち','ch'],['に','ny'],['ひ','hy'],['み','my'],['り','ry'],['ぎ','gy'],['じ','j'],['び','by'],['ぴ','py']].forEach(([base,prefix])=>['ゃ','ゅ','ょ'].forEach((small,i)=>kanaEntry(base+small,prefix+['a','u','o'][i],'youon','O segundo kana é pequeno. A combinação ocupa uma mora.')));
[['っ','sokuon','Indica geminação da consoante seguinte; ocupa uma mora.','切手 (きって, kitte) — selo'],['ー','chōonpu','Prolonga a vogal precedente em uma mora adicional.','コーヒー (kōhī) — café'],['ゔ','vu','Forma com dakuten; usada principalmente como ヴ em estrangeirismos.','ヴァイオリン — violino'],['ふぁ','fa','Combinação usada principalmente como ファ em estrangeirismos.','ファイル — arquivo'],['ふぃ','fi','Combinação usada principalmente como フィ em estrangeirismos.','フィルム — filme'],['ふぇ','fe','Combinação usada principalmente como フェ em estrangeirismos.','カフェ — café'],['ふぉ','fo','Combinação usada principalmente como フォ em estrangeirismos.','フォーク — garfo'],['てぃ','ti','Combinação usada principalmente como ティ em estrangeirismos.','パーティー — festa']].forEach(([h,r,n,e])=>kanaEntry(h,r,'specials',n,e));
const HIRA_STROKES = [3,2,2,2,3,3,4,1,3,2,3,1,2,3,1,4,2,1,1,2,4,3,2,2,1,3,1,4,1,4,3,2,3,2,3,3,2,2,2,2,1,2,1,2,3,1];
const VOCAB = [
 ['朝 (あさ)','Manhã','雨 (あめ)','Chuva'],['犬 (いぬ)','Cão','今 (いま)','Agora'],['海 (うみ)','Mar','歌 (うた)','Canção'],['駅 (えき)','Estação','絵 (え)','Desenho'],['男 (おとこ)','Homem','お茶 (おちゃ)','Chá'],
 ['川 (かわ)','Rio','傘 (かさ)','Guarda-chuva'],['木 (き)','Árvore','切手 (きって)','Selo postal'],['車 (くるま)','Carro','口 (くち)','Boca'],['警察 (けいさつ)','Polícia','今朝 (けさ)','Esta manhã'],['言葉 (ことば)','Palavra','子供 (こども)','Criança'],
 ['魚 (さかな)','Peixe','桜 (さくら)','Cerejeira'],['白 (しろ)','Branco','新聞 (しんぶん)','Jornal'],['寿司 (すし)','Sushi','雀 (すずめ)','Pardal'],['世界 (せかい)','Mundo','先生 (せんせい)','Professor'],['空 (そら)','Céu','外 (そと)','Fora'],
 ['卵 (たまご)','Ovo','太陽 (たいよう)','Sol'],['父 (ちち)','Meu pai','地図 (ちず)','Mapa'],['月 (つき)','Lua','机 (つくえ)','Mesa'],['手 (て)','Mão','手紙 (てがみ)','Carta'],['友達 (ともだち)','Amigo','時計 (とけい)','Relógio'],
 ['夏 (なつ)','Verão','名前 (なまえ)','Nome'],['肉 (にく)','Carne','日本 (にほん)','Japão'],['ぬいぐるみ','Pelúcia','布 (ぬの)','Tecido'],['猫 (ねこ)','Gato','熱 (ねつ)','Febre'],['海苔 (のり)','Alga','飲み物 (のみもの)','Bebida'],
 ['花 (はな)','Flor','春 (はる)','Primavera'],['昼 (ひる)','Dia','光 (ひかり)','Luz'],['冬 (ふゆ)','Inverno','船 (ふね)','Barco'],['部屋 (へや)','Quarto','下手 (へた)','Desajeitado'],['星 (ほし)','Estrela','本 (ほん)','Livro'],
 ['街 (まち)','Cidade','前 (まえ)','Frente'],['水 (みず)','Água','道 (みち)','Caminho'],['虫 (むし)','Inseto','昔 (むかし)','Outrora'],['目 (め)','Olho','眼鏡 (めがね)','Óculos'],['森 (もり)','Floresta','門 (もん)','Portão'],
 ['山 (やま)','Montanha','野菜 (やさい)','Vegetais'],['雪 (ゆき)','Neve','夢 (ゆめ)','Sonho'],['夜 (よる)','Noite','予定 (よてい)','Plano'],
 ['来週 (らいしゅう)','Próxima semana','ラジオ','Rádio'],['りんご','Maçã','旅行 (りょこう)','Viagem'],['留学生 (りゅうがくせい)','Estudante internacional','車 (くるま)','Carro'],['冷蔵庫 (れいぞうこ)','Geladeira','歴史 (れきし)','História'],['廊下 (ろうか)','Corredor','六 (ろく)','Seis'],
 ['私 (わたし)','Eu','話題 (わだい)','Tópico'],['水を飲む (みずをのむ)','Beber água','本を読む (ほんをよむ)','Ler livro'],['日本 (にほん)','Japão','本 (ほん)','Livro']
];
KANA.filter(e=>e.group==='gojuon').forEach((entry,i)=>{entry.strokes=HIRA_STROKES[i];entry.examples=VOCAB[i];});
KANA.filter(e=>e.group==='dakuon').forEach(entry=>{const base=entry.hira.normalize('NFD')[0];entry.strokes=KANA.find(e=>e.hira===base)?.strokes+(entry.hira.normalize('NFD')[1]==='\u309a'?1:2);});
const descriptions = [
'Traço horizontal firme seguido de laço aberto descendente.',
'Dois traços verticais ligeiramente curvados em harmonia.',
'Pequeno acento superior com arco amplo curvado abaixo.',
'Traço pontual inicial seguido de zigue-zague elegante.',
'Traço horizontal, corte vertical com laço e pingo à direita.',
'Traço descendente angulado com acento pontual.',
'Dois traços horizontais paralelos atravessados por diagonal.',
'Traço único em ângulo agudo simples voltado para a esquerda.',
'Traço vertical esquerdo equilibrado por cruzamento à direita.',
'Dois arcos horizontais paralelos abertos.',
'Traço horizontal com cruzamento e arco inferior.',
'Anzol vertical suave que sobe levemente à direita.',
'Traço horizontal cortado por vertical com laço em espiral.',
'Base horizontal aberta com dois cortes verticais conectados.',
'Linha contínua em zigue-zague culminando num arco curvado.',
'Corte horizontal com cruzamento e pequeno elemento こ.',
'Traço horizontal cruzado por curva descendente com volta.',
'Uma única onda fluida que se ergue e desce à direita.',
'Linha horizontal suave que curva para a esquerda em forma de C invertido.',
'Traço diagonal curto seguido de arco aberto inferior.',
'Cruz com ponto e nó inferior distintivo.',
'Coluna vertical esquerda equilibrada por dois traços de こ.',
'Diagonal suave cortada por curva contínua com laço final fechado.',
'Vertical esquerda com cruzamento ziguezagueante e pequeno nó terminal.',
'Linha espiral única e fluida desenhada sem levantar o pincel.',
'Traço vertical esquerdo com haste horizontal e laço fechado à direita.',
'Arco côncavo amplo que se curva para a direita num único gesto.',
'Gesto central equilibrado por três pingos satélites caligráficos.',
'Telhado em V invertido aberto desenhado de forma simétrica.',
'Semelhante a は, com traço superior protetor que não transpassa.',
'Duas linhas horizontais atravessadas com laço terminal inferior.',
'Laço fluído inclinado que é cortado por um traço descendente.',
'Traço horizontal, corte com loop aberto e pingo final no canto superior.',
'Forma idêntica a ぬ porém sem o loop terminal final.',
'Anzol vertical cruzado por duas linhas horizontais firmes.',
'Gancho curvo com pingo e haste diagonal longa.',
'Círculo aberto que mergulha e é cortado por traço vertical curvo.',
'Traço horizontal curto com laço e haste vertical de ancoragem.',
'Ponto superior com arco descendente ligeiramente arredondado.',
'Duas linhas verticais em cascata, sendo a direita significativamente mais longa.',
'Traço único dinâmico terminado em pequeno laço circular fechado.',
'Vertical esquerda com cruzamento que se curva abertamente para a direita.',
'Idêntico a る, mas sem o pequeno nó inferior no fechamento.',
'Vertical esquerda com arco aberto suave à direita.',
'Usado exclusivamente como partícula gramatical de objeto direto.',
'A única consoante autônoma que fecha sílabas japonesas sem vogal de apoio.'
];
KANA.filter(e=>e.group==='gojuon').forEach((entry,i)=>{entry.note=descriptions[i];entry.badge=entry.romaji.toUpperCase()+' (Gojūon)';});
Object.entries({a:'A (Vogal pura)',i:'I (Vogal pura)',u:'U (Vogal comprimida)',e:'E (Vogal pura)',o:'O (Vogal pura)',shi:'Shi (Irregular: [ɕi] não [si])',chi:'Chi (Irregular: [t͡ɕi] não [ti])',tsu:'Tsu (Irregular: [t͡sɯ] não [tu])',fu:'Fu (Bilabial suave: [ɸɯ])',wo:'Wo / O (Partícula gramatical)',n:'N (Nasal silábica)'}).forEach(([r,b])=>{KANA.find(e=>e.romaji===r).badge=b;});
const voicedVocab = [
['学生 (がくせい)','Estudante','学校 (がっこう)','Escola'],['銀 (ぎん)','Prata','銀行 (ぎんこう)','Banco'],['軍 (ぐん)','Exército','具合 (ぐあい)','Condição'],['元気 (げんき)','Saudável','下駄 (げた)','Geta'],['午後 (ごご)','Tarde/PM','ご飯 (ごはん)','Refeição'],
['雑誌 (ざっし)','Revista','座る (すわる)','Sentar'],['時間 (じかん)','Tempo/Hora','自分 (じぶん)','A si mesmo'],['地図 (ちず)','Mapa','涼しい (すずしい)','Fresco'],['全部 (ぜんぶ)','Tudo','ぜひ','Sem falta'],['象 (ぞう)','Elefante','家族 (かぞく)','Família'],
['大学 (だいがく)','Universidade','台所 (だいどころ)','Cozinha'],['鼻血 (はなぢ)','Sangramento nasal','縮む (ちぢむ)','Encolher'],['続く (つづく)','Continuar','気付く (きづく)','Notar'],['電話 (でんわ)','Telefone','電車 (でんしゃ)','Trem'],['どこ','Onde','土曜日 (どようび)','Sábado'],
['場所 (ばしょ)','Lugar','晩御飯 (ばんごはん)','Jantar'],['病院 (びょういん)','Hospital','美術館 (びじゅつかん)','Museu de Arte'],['豚肉 (ぶたにく)','Carne de porco','文学 (ぶんがく)','Literatura'],['便利 (べんり)','Prático/Conveniente','弁当 (べんとう)','Marmita/Bento'],['帽子 (ぼうし)','Chapéu','貿易 (ぼうえき)','Comércio exterior'],
['パン','Pão','パーティー','Festa'],['ピアノ','Piano','ピカピカ','Brilhante'],['プール','Piscina','プレゼント','Presente'],['ペン','Caneta','ペラペラ','Fluente em idioma'],['ポケット','Bolso','ポスト','Caixa de correio']
];
KANA.filter(e=>e.group==='dakuon').forEach((entry,i)=>{entry.examples=voicedVocab[i];entry.badge=entry.romaji.toUpperCase()+' ('+('ぱぴぷぺぽ'.includes(entry.hira)?'Handakuten / Maru':'Dakuten')+')';});
const contractedVocab = {
きゃ:['客 (きゃく)','Convidado/Cliente','きゃあ','Grito de surpresa'],きゅ:['急 (きゅう)','Urgente','牛肉 (ぎゅうにく)','Carne'],きょ:['今日 (きょう)','Hoje','京都 (きょうと)','Quioto'],
しゃ:['写真 (しゃしん)','Foto','会社 (かいしゃ)','Empresa'],しゅ:['宿題 (しゅくだい)','Lição de casa','趣味 (しゅみ)','Hobby'],しょ:['食堂 (しょくどう)','Refeitório','辞書 (じしょ)','Dicionário'],
ちゃ:['お茶 (おちゃ)','Chá','茶碗 (ちゃわん)','Tigela de arroz'],ちゅ:['中国 (ちゅうごく)','China','駐車場 (ちゅうしゃじょう)','Estacionamento'],ちょ:['ちょっと','Um momento','朝食 (ちょうしょく)','Café da manhã'],
にゃ:['猫の鳴き声 (にゃー)','Miau','',''],にゅ:['牛乳 (ぎゅうにゅう)','Leite','入院 (にゅういん)','Internação hospitalar'],にょ:['女房 (にょうぼう)','Esposa tradicional','',''],ひゃ:['百 (ひゃく)','Cem','',''],りゅ:['留学 (りゅうがく)','Intercâmbio','竜 (りゅう)','Dragão'],ぎょ:['魚 (ぎょ / ぎょかい)','Pescados','授業 (じゅぎょう)','Aula']
};
KANA.filter(e=>e.group==='youon').forEach(entry=>{entry.examples=contractedVocab[entry.hira]||[];entry.strokes=[...entry.hira].reduce((sum,c)=>sum+(KANA.find(e=>e.hira===({ゃ:'や',ゅ:'ゆ',ょ:'よ'}[c]||c))?.strokes||0),0);entry.badge=entry.romaji.toUpperCase()+' (Yōon)';});
