# 🇯🇵 Estudo de Japonês — Treino & Ferramentas

Este repositório reúne pequenas ferramentas e exercícios interativos que criei para praticar e reforçar o aprendizado da língua japonesa.

🌐 **Acesse diretamente pelo navegador:** [nihongodrills.com](https://nihongodrills.com/)

---

## 🛠️ Ferramentas disponíveis

### 🎯 助数詞ドリル (Treino de Contadores)

Uma ferramenta interativa para treinar a leitura de contadores japoneses (**助数詞 - *Josuushi***) em Hiragana. As quantidades vão de 1 a 100, exceto つ (1–10) e 時 (1–24).

* **Contadores inclusos:** つ, 個, 冊, 杯, 日, 枚, 時, 本, 台, 分, ヶ月, 足, 人, 匹, 年.
* **Como funciona:** Selecione os contadores desejados no menu lateral, responda aos desafios em hiragana e receba validação instantânea.
* **Guia de consulta:** Tabela comparativa de 本, 匹, 杯 e つ, além de um diálogo com as leituras de 1 a 10 das 15 categorias.

---

### ✍️ かな入力ドリル (Treino de Digitação Kana)

Exercício prático para treinar a leitura e digitação de Hiragana e Katakana, com entrada em romaji ou no kana esperado.

* **Como funciona:** O sistema exibe frases em kana e destaca os trechos concluídos conforme você digita. Erros não avançam o cursor.
* **Métricas:** CPM, WPM (CPM dividido por cinco), precisão, tempo e intervalos entre entradas. Os resultados da sessão incluem apenas frases concluídas.

---

### 📅 日にちドリル (Treino de Dias do Mês)

Ferramenta focada na prática de leitura dos dias do mês em japonês (1 a 31) em Hiragana com auxílio de calendário visual.

* **Foco em exceções:** Permite filtrar o treino entre todos os dias (1–31) ou focar apenas nas leituras irregulares/exceções (1–10, 14, 20 e 24).
* **Entrada:** Aceita hiragana ou variantes de romaji cadastradas; o campo preserva o texto até a validação. Inclui avanço pelo teclado com Enter, dicas contextuais e tabela completa dos 31 dias.

---

### 🔤 て形ドリル (Treino da Forma て)

Exercício para praticar a conjugação de verbos japoneses para a forma て.

* **Filtros por grupo:** Pratique verbos do grupo 1 (五段), grupo 2 (一段) e irregulares separadamente ou misturados.
* **Validação e dicas:** Responda em hiragana ou romaji, receba feedback imediato e consulte a regra de conjugação como dica.
* **Guia de consulta:** Resumo das terminações por grupo e das exceções する, 来る e 行く.

### 📝 Flexão de Adjetivos

Drill interativo para praticar as formas polidas (com です), afirmativas e negativas, de adjetivos い e な no presente e no passado. Inclui dica opcional de classe, conversão de romaji para hiragana e guia de flexões.

### 🔎 Tabela de Kana

Consulta de Hiragana e Katakana com 46 caracteres básicos, 25 sonorizados e 15 amostras de yōon, além de explicações sobre sons especiais.

* **Consulta:** Busca por kana ou romaji, filtros por bloco, modo comparativo e painel com exemplos e contagens de traços de hiragana.
* **Áudio:** Clicar em um card solicita sua pronúncia com síntese japonesa do navegador. A reprodução automática começa ligada e pode ser silenciada; a voz disponível depende do navegador e do sistema.
* **Acesso:** [Abrir Tabela de Kana](kana/).

---

## 📝 Próximos passos

* [x] Quiz das 15 categorias de contadores, respeitando seus limites de quantidade
* [x] Treino interativo de digitação em Kana (Hiragana / Katakana)
* [x] Treino de leitura e exceções dos dias do mês com calendário (1 a 31)
* [x] Treino da Forma て com filtros, dicas e furigana
* [x] Flexão de adjetivos い e な em formas polidas
* [x] Página de consulta de Kana com síntese de voz japonesa

### Correções e revisão de conteúdo

* [ ] Harmonizar as variantes da tabela de Contadores com as respostas aceitas pelo validador.
* [ ] Revisar a “Regra de Ouro da Linha H” para não generalizar mudanças sonoras de 本, 匹 e 杯.
* [ ] Revisar a classificação das frases nos filtros Hiragana/Katakana e os textos dos bancos de exercícios.
* [ ] Revisar exemplos, traduções, leituras e descrições de traços da tabela de Kana.
* [ ] Explicitar as formas polidas de Adjetivos também nas tags da home.
* [ ] Informar quando uma combinação de filtros da Forma て faz o foco voltar automaticamente a todas as terminações.
* [ ] Revisar rótulos de JLPT, “Sistema Guiado”, recomendação de drill e promessas pedagógicas que não são medidas pela aplicação.

### Validação e manutenção

* [ ] Validar todas as telas em desktop, tablet e celulares reais, incluindo teclado virtual, composição, autocorreção e colagem na Leitura.
* [ ] Auditar navegação por teclado, leitores de tela e contraste, especialmente os cards de exceção de Kana.
* [ ] Confirmar a reprodução audível e a disponibilidade de voz japonesa nos navegadores e sistemas de interesse.
* [ ] Avaliar uma fonte japonesa explícita e a visibilidade das barras de rolagem.
* [ ] Fixar versões das dependências remotas e avaliar assets locais caso seja necessário funcionamento offline.
* [ ] Consolidar os tokens visuais duplicados entre as páginas.

### Decisões de produto

* [ ] Definir se haverá histórico local para alimentar as métricas diárias da home, sem contas de usuário.
* [ ] Definir o comportamento ao atingir as metas visuais de 25 respostas em Forma て e Contadores.
* [ ] Definir a cobertura da consulta de Kana: o banco contém combinações que ainda não aparecem como cards, e só あ tem esquema de ordem de traços.
* [ ] Configurar a publicidade antes de ativá-la, caso seja desejada.

SRS, XP, radicais, frases em kanji/furigana, novas métricas e calendário com mês/ano são expansões opcionais, sem compromisso de implementação. Contas de usuário estão fora do escopo.
