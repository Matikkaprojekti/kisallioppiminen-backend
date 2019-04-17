# kisallioppiminen-backend

### Ohjeet backendin lokaaliin devauskäyttöön:
1. Asenna postgresql ja luo postgresql käyttäjä 

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres psql
postgres=# create database kisallioppiminen;
postgres=# create user myuser with encrypted password 'mypass';
postgres=# grant all privileges on database kisallioppiminen to myuser;
```

2. `git clone git@github.com:Matikkaprojekti/kisallioppiminen-backend.git && cd kisallioppiminen-backend/`
3. Kopioi .env.example -> .env ja täytä kentät. Huom tarvitset GOOGLE_CLIENT_ID ja GOOGLE_CLIENT_SECRET joltain projektilaiselta!

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NODE_ENV=dev
APP_PORT=8000
DATABASE_USER=eero
DATABASE_URL=localhost
DATABASE_PASSWORD=
DATABASE_PORT=5432
DATABASE_NAME=kisallioppiminen
PROD_URL=
FRONTEND_URL 
```

4. `npm install`
5. ` node_modules/.bin/knex migrate:latest `
6. `npm run watch`
7. Testaa lokaalin backendin toimivuus menemällä [tänne](http://localhost:8000/)

-----

### Tietokannan kuvaus:

![tietokantakuva](/readme_images/tietokanta.png)

-----

### Infrakaavio:

![infrakaavio](/readme_images/infrakaavio.png)

-----

### Tarjolla olevat urlit:

| Metodi(t) | URL                  | Kuvaus                              |
| --------- | ----------------------------------- | ------------------------------------------------------------------ |
| GET       | `/users/auth`                       | Authentikoi käyttäjän              				       |
| GET       | `/users/me`                         | Hakee kirjautuneen käyttäjän tiedot				       |
| POST      | `/teachinginstances`		  | Luo uuden opetusinstanssin					       |
| GET       | `/teachinginstances/:teacher`       | Hakee opetusinstanssit joilla käyttäjä on omistaja tai opiskelija  |
| PATCH     | `/teachinginstances` 		  | Liittää käyttäjän opetusinstanssiin				       |
| DELETE    | `/teachinginstances/:coursekey`     | Poistaa käyttäjän opetusinstanssista			       |
| PUT       | `/trafficlights/:exercise_uuid`	  | Opiskelija klikkaa liikennevaloa...  			       |

-------------

#### POST `/teachinginstances`
- coursekey ei ole case-sensitive. Jos post pyynnössä on isoja kirjaimia ne muutetaan backendissä pieniksi.

Request body format: 
```json
{
	"coursekey":"uusitesti",
	"name":"Kissalan matikka 2019",
	"startdate":"28.12.2019",
	"enddate":"30.1.2030",
	"coursematerial_name":"MAY2",
	"version":"1.2"
}
```
Response body format:
```json
{
    "coursekey": "uusitesti",
    "name": "Kissalan matikka 2019",
    "startdate": "28.12.2019",
    "enddate": "Wed Jan 30 2030 00:00:00 GMT+0200 (EET)",
    "coursematerial_name": "MAY2",
    "version": "1.2",
    "owner_id": 1,
    "students": []
}
```

Mahdolliset virheviestit: 
```
res.status(401).json({ error: 'unauthorized' })
res.status(403).json({ error: 'Käyttäjä on jo kurssilla' })
res.status(401).json({ error: 'Luvaton pyyntö' })
res.status(400).json({ error: 'Käyttäjää tai kurssia ei löytynyt' })
res.status(400).json({ error: 'Kurssiavain puuttuu' })
```

----------
#### GET `/teachinginstances?teacher=false`
- `/teachinginstances?teacher=true` palauttaa kurssit, joilla käyttäjä on luonut.
- `/teachinginstances?teacher=false` palauttaa kurssit, joille käyttäjä on liittynyt opiskelijaksi.

Request body format: 
```json
{

}
```
Response body format:
```json
[
    {
        "coursekey": "kurssiavain",
        "coursematerial_name": "MAY1 - Luvut ja lukujonot",
        "version": "1",
        "name": "kurssinimi",
        "startdate": "Wed Apr 03 2019 00:00:00 GMT+0300 (EEST)",
        "enddate": "Tue Apr 30 2019 00:00:00 GMT+0300 (EEST)",
        "owner_id": 1,
        "students": [
            {
                "firstname": "Kissa",
                "lastname": "Ankka",
                "exercises": [
                    {
                        "uuid": "12a9f39a-3b49-11e9-a38a-09f848b19644",
                        "status": "green"
                    },
                    {
                        "uuid": "12a9f399-3b49-11e9-a38a-09f848b19644",
                        "status": "yellow"
                    }
                ]
            }
        ]
    },
    {
        "coursekey": "avainkurssi",
        "coursematerial_name": "MAY1 - Luvut ja lukujonot",
        "version": "1.1",
        "name": "nimikurssi",
        "startdate": "Wed Apr 03 2019 00:00:00 GMT+0300 (EEST)",
        "enddate": "Wed Apr 24 2019 00:00:00 GMT+0300 (EEST)",
        "owner_id": 1,
        "students": [
            {
                "firstname": "Peter",
                "lastname": "Pan",
                "exercises": [
                    {
                        "uuid": "12a9f396-3b49-11e9-a38a-09f848b19644",
                        "status": "red"
                    },
                    {
                        "uuid": "12a9f397-3b49-11e9-a38a-09f848b19644",
                        "status": "yellow"
                    },
                    {
                        "uuid": "12a9f398-3b49-11e9-a38a-09f848b19644",
                        "status": "yellow"
                    }
                ]
            }
        ]
    }
]
```
Mahdolliset virheviestit: 
```
res.status(401).json({ error: 'unauthorized' })
res.status(400).json({ error: 'Virheelliset opettajan tiedot.' })

```

------------
#### PATCH `/teachinginstances/` (Kurssi-instanssiin liittyminen)
- coursekey ei ole case-sensitive. Jos post pyynnössä on isoja kirjaimia ne muutetaan backendissä pieniksi.

Request body format: 
```json
{
	"coursekey":"kissalan lukio"
}
```
Response body format:
```json
{
    "coursekey": "uusitesti",
    "coursematerial_name": "MAY2",
    "version": "1.2",
    "name": "Kissalan matikka 2019",
    "startdate": "2019-12-27T22:00:00.000Z",
    "enddate": "2030-01-29T22:00:00.000Z",
    "owner_id": 1,
    "students": [
        {
            "firstname": "Kissa",
            "lastname": "Ankka",
            "exercises": [
                {}
            ]
        }
    ]
}
```

Mahdolliset virheviestit: 
```
res.status(400).json({ error: 'Kurssiavain puuttuu' })
res.status(403).json({ error: 'Käyttäjä on jo kurssilla' })
res.status(401).json({ error: 'Luvaton pyyntö' })
res.status(400).json({ error: 'Kurssia ei löydy' })
res.status(400).json({ error: 'Käyttäjää tai kurssia ei löytynyt' })
res.status(400).json({ error: 'Virheellinen pyyntö!' })
```
        

#### DELETE `/teachinginstances/:coursekey` (Poistu kurssilta klikkaaminen)
- Poistaa käyttäjän opetusinstanssilta.

Request body format: 
```json
{}
```
Response body format:
```json
{
	"message": "Päivitys valmis."
}
```

Mahdolliset virheviestit:
```
res.status(401).json({ error: 'unauthorized' })
res.status(404).json({ error: 'Virheellinen pyyntö!' })
```

------------
#### PUT `/trafficlights/:exercise_uuid` (Liikennevalon klikkaaminen)
- Luo uuden exercisen jos sellaista ei ole.
- Jos sama käyttäjä on klikkaa uudelleen aikaisemmin klikkaamaansa liikennevaloa, päivitetään sen väriä.

Request body format: 
```json
{
	"status":"red",
	"coursekey":"kurssiavain"
}
```
Response body format:
```json
{
	"message":"Päivitys valmis."
}
```

Mahdolliset virheviestit:
```
res.status(401).json({ error: 'Unauthorized' })
res.status(400).json({ error: 'Jokin pyynnön parametri puuttuu' })
```
------------

