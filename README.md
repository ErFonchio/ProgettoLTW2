# GAME OF LIFE

Ciao, questa è la repository per il progetto di Linguaggi e Tecnologie per il Web del gruppo formato da Giulia Battioni, Alessandro Coccia e Francesco Maura del terzo anno di ingegneria informatica alla Sapienza.

## Introduzione

Il Gioco della vita (Game of Life in inglese, noto anche solo come Life) è un automa cellulare sviluppato dal matematico inglese John Conway sul finire degli anni sessanta. Il Gioco della vita è l'esempio più famoso di automa cellulare: il suo scopo è quello di mostrare come comportamenti simili alla vita possano emergere da regole semplici e interazioni a molti corpi, principio che è alla base dell'ecobiologia, la quale si rifà anche alla teoria della complessità.
Si tratta in realtà di un gioco senza giocatori, intendendo che la sua evoluzione è determinata dal suo stato iniziale, senza necessità di alcun input da parte di giocatori umani. Si svolge su una griglia di caselle quadrate (celle) che si estende all'infinito in tutte le direzioni; questa griglia è detta mondo. Ogni cella ha 8 vicini, che sono le celle ad essa adiacenti, includendo quelle in senso diagonale. Ogni cella può trovarsi in due stati: viva o morta (o accesa e spenta, on e off). Lo stato della griglia evolve in intervalli di tempo discreti, cioè scanditi in maniera netta. Gli stati di tutte le celle in un dato istante sono usati per calcolare lo stato delle celle all'istante successivo. Tutte le celle del mondo vengono quindi aggiornate simultaneamente nel passaggio da un istante a quello successivo: passa così una generazione.

Le transizioni dipendono unicamente dallo stato delle celle vicine in quella generazione:

Qualsiasi cella viva con meno di due celle vive adiacenti muore, come per effetto d'isolamento;
Qualsiasi cella viva con due o tre celle vive adiacenti sopravvive alla generazione successiva;
Qualsiasi cella viva con più di tre celle vive adiacenti muore, come per effetto di sovrappopolazione;
Qualsiasi cella morta con esattamente tre celle vive adiacenti diventa una cella viva, come per effetto di riproduzione.


## Implementazione

Per l'implementazione abbiamo utilizzato esclusivamente elementi nativi di JavaScript scegliendo di non utilizzare librerie grafiche per vari motivi:

* Velocità di caricamento e fluidità
* Leggerezza
* Sfida con noi stessi

L'intera finestra di gioco (playground) è stata realizzata utilizzando codice Javascript per l'aggiornamento dei vari elementi della pagina in base alle regole stabilite sopra. Ogni cella è un campo di una tabella creata dinamicamente dal codice javascript.


## Design

Per le scelte stilistiche utilizziamo il Material Design M3 di Google. La scelta è ricaduta sul material design per la sua eleganza e modernità, oltre al fatto della sua popolarità in campo di Web Development.
