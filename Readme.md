# ReadMe

## Creare articolo

### Tramite NPM

Articolo

```plaintext
npm run article --slug="mio-slug"
```

CSTip:

```plaintext
npm run cstip --slug="mio-slug"
```

Articolo:

```plaintext
npm run archi --slug="mio-slug"
```

Libro:

```plaintext
npm run book --slug="mio-slug"
```

### Tramite Hugo

Articolo:

```plaintext
hugo new --kind article article/2023/01-article/
```

Archi:

```plaintext
hugo new --kind archi architecture-note/01-article
```

C#:

```plaintext
hugo new --kind cstip csharp-tip/01-article/index.md
```

Book:

```plaintext
hugo new --kind book book-review/01-article/index.md
```

## Lanciare in locale

```plaintext
hugo server
```

## Come inizializzare progetto partendo da zero

1. Clona sia questo repository che [quello del tema](https://github.com/code4it-dev/bilberry-hugo-theme) nella stessa cartella;
2. Nella cartella del blog, inizializza le dipendenze di npm usando `npm i`;
3. Assicurati che [Hugo sia installato](https://gohugo.io/installation/windows/); se non lo e', apri un Terminale **come admin** e lancia `choco install hugo-extended`;
4. se sia il tema che il blog sono nella stessa directory, **apri un terminale nella cartella parent** e lancia `cp -r bilberry-hugo-theme c4it-hugo/themes` per copiare il tema nella cartella `/themes` del blog. 
5. controlla che sotto la cartella `/themes` ci sia una sola cartella `bilberry-hugo-theme`, e che non sia duplicata su piu' livelli.

## Come modificare tema

Il tema ed il blog girano su due sistemi separati. Servono quindi due console aperte: una sul blog (/code4it-hugo) e l'altra sul tema (/code4it-hugo/themes/bilberry-theme).

Per fare le modifiche come test:

1. modifica il tema
2. lancia `npm run dev` nella console THEME. Vedrai un _dirty-commit_ nel file bilberry-hugo-theme (eg: Subproject commit 9afb01ad8adc4c38160021b293feb9cec84a8e03-dirty)
3. lancia `hugo server` nella console BLOG.

Per approvare le modifiche:

1. lancia `npm run production` nella console THEME per pulire la history di git
2. fai commit delle modifiche nel tema
3. lancia `npm run production` nella console THEME. _Controlla di avere il commit pulito nel file bilberry-hugo-theme_, quindi senza -dirty. Se non ha funzionato, fai di nuovo Commit + run production
4. `git push` del tema
5. `git push` del blog

Vedi [qui](https://github.com/code4it-dev/c4it-hugo/pull/4)

## Colori tema

```scss
$theme-dark-aqua: #488a99;
$theme-gold: #dbae58;
$theme-charcoal: #4d585b;
$theme-gray: #b4b4b4;
```

## Default shortocdes

`{{< param testparam >}}` per riferire a cose in frontmatter

`{{< youtube w7Ft2ymGmfc >}}` per youtube

`{{< tweet user="BelloneDavide" id="1598349951876173824" >}}` per twitter

## Definisci series

In frontmatter, aggiungi

```yml
series: ["My New Super Series"]
```

Questo crea una pagina sotto `/series/`.

Per elencare gli articoli nella serie usa

`{{< series "My New Super Series" >}}`
