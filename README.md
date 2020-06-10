# Progetto per il corso "Tecnologie e linguaggi per il web"
Il progetto realizzato consiste in una web live chat: Un utente, dopo
essersi registrato, può iniziare a chattare con i propri amici/conoscenti
solamente conoscendo il loro username (scelto appositamente nella fase
di registrazione).
Per ottimizzare la velocità di esecuzione ho deciso di non affidarmi a
framework lato client (es: jquery, angular ecc..), ma ho realizzato tutto il
codice con javascript nativo, attraverso il pattern Model View Controller
con la specifica standard ECMAScript 6.
Per il server ho utlizzato Node.js con il framework Express.
come DBMS ho utilizzato Postgresql, con la libreria ’pg-promise’ per
interfacciarmi ad esso.
