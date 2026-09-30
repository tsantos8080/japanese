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

## Idiomas

A home e os seis módulos oferecem `pt-BR` e `en`, com seletor no cabeçalho. A escolha fica salva em `localStorage`; no primeiro acesso, usa o primeiro idioma compatível da lista do navegador, com português como fallback. A troca de idioma preserva a questão atual, a resposta digitada e os filtros.

As traduções da home ficam em `locales/pt-BR.js` e `locales/en.js`; as dos módulos, em `locales/modules.pt-BR.js` e `locales/modules.en.js`. Nos módulos, o texto original em português serve como chave, com interpolação para mensagens dinâmicas. O arquivo `i18n.js` aplica as chaves `data-i18n`, `data-i18n-aria-label` e `data-i18n-content`, além de placeholders, títulos de controles e textos alternativos. Mensagens dinâmicas usam `NihongoI18n.bindText` para atualizar somente a apresentação, incluindo dicas e traduções do vocabulário. Japonês, respostas esperadas e identificadores de analytics permanecem independentes do idioma. A biblioteca i18next 23.16.8 está em `vendor/`, com sua licença, e não exige build nem alteração da publicação no GitHub Pages. O conteúdo original em português continua acessível se o JavaScript de tradução não carregar.

Validação: `node tests/i18n.test.cjs` e `node tests/modules-i18n.test.cjs`.

## Analytics

Todas as páginas usam o GA4 `G-W1SDFKSFH6`. Os módulos carregam o helper compartilhado `analytics.js` e registram:

| Evento | Quando é enviado |
| --- | --- |
| `practice_start` | Primeira entrada não vazia, resposta, dica aberta, questão pulada ou interação com um card/áudio de Kana; uma vez por carregamento do módulo. |
| `answer_submit` | Resposta não vazia validada em Adjetivos, Forma て, Contadores ou Dias; uma vez por questão, com `result` igual a `correct` ou `incorrect`. |
| `hint_open` | Dica revelada pelo usuário, com `hint_type` igual a `rule`, `class` ou `romaji`. Dicas exibidas automaticamente não contam. |
| `question_skip` | Botão de pular usado numa questão ainda não respondida; na Leitura, avançar uma frase incompleta. Não conta após o tempo acabar. |
| `phrase_complete` | Frase de Leitura concluída, com `duration_seconds`, `character_count`, `error_count` e `accuracy` (percentual). |
| `kana_audio_click` | Pronúncia solicitada, com `source` (`card`, `icon`, `inspector`, `example` ou `keyboard`) e `audio_support` (`available` ou `unavailable`). Não comprova reprodução audível. |

Os eventos incluem `module`, `mode` e `category`; as conjugações também incluem `form`. `category` identifica a classe de adjetivo/verbo, contador, leitura regular/irregular, tipo de frase ou bloco de Kana. Reiniciar exercícios não cria outro `practice_start` no mesmo carregamento. Não são enviados respostas digitadas, buscas, palavras, frases ou eventos por tecla. A prática continua funcionando se o analytics estiver bloqueado ou indisponível.

Para conferir a integração, use o relatório **Tempo real** do GA4 após interagir com os módulos. Para segmentar os relatórios, cadastre dimensões personalizadas de escopo **Evento** para `module`, `mode`, `category`, `form`, `result`, `hint_type`, `source` e `audio_support`. Os valores numéricos de `phrase_complete` podem ser cadastrados como métricas personalizadas de escopo Evento (segundos para duração; unidades padrão para os demais). As visualizações de página continuam sendo registradas pela configuração padrão do Google tag.
