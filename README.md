# kisallioppiminen-backend

### Ohjeet backendin lokaaliin devauskäyttöön:
1. `git clone git@github.com:Matikkaprojekti/kisallioppiminen-backend.git && cd kisallioppiminen-backend/ && npm install && npm run watch`
2. Testaa lokaalin backendin toimivuus menemällä [tänne](http://localhost:8000/)


### Tietokannan kuvaus:
![tietokantakuva](/readme_images/tietokanta.png)


### Tarjolla olevat urlit:

| Metodi(t) | URL                       | Kuvaus |
| --------| --------------------------- |---------------------------------------|
| GET     | `/users/auth`               | Authentikoi käyttäjän                 |
| GET     | `/users/me`                 | Hakee kirjautuneen käyttäjän tiedot   |
| POST    | `/courseinstances`         |Luo uuden opetusinstanssin              |
