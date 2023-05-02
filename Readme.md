# ReadMe

## Creare articolo

Articolo:

```plaintext
hugo new article/2023/01-article/index.md
```

Archi:

```plaintext
hugo new architecture-note/01-article/index.md
```

C#:

```plaintext
hugo new csharp-tip/01-article/index.md
```

## Lanciare in locale

```plaintext
hugo server
```


## Come modificare tema

Il tema ed il blog girano su due sistemi separati. Servono quindi due console aperte: una sul blog (/code4it-hugo) e l'altra sul tema (/code4it-hugo/themes/bilberry-theme).

Per fare le modifiche come test:

1. modifica il tema
2. lancia `npm run dev` nella console THEME. Vedrai un *dirty-commit* nel file bilberry-hugo-theme (eg: Subproject commit 9afb01ad8adc4c38160021b293feb9cec84a8e03-dirty)
3. lancia `hugo server` nella console BLOG.

Per approvare le modifiche:

1. lancia `npm run production` nella console THEME per pulire la history di git
2. fai commit delle modifiche nel tema
3. lancia `npm run production` nella console THEME. *Controlla di avere il commit pulito nel file bilberry-hugo-theme*, quindi senza -dirty. Se non ha funzionato, fai di nuovo Commit + run production
4. `git push` del tema
5. `git push` del blog


Vedi [qui](https://github.com/code4it-dev/c4it-hugo/pull/4)