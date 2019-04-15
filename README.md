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

### Tietokannan kuvaus:

![tietokantakuva](/readme_images/tietokanta.png)

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
	"version":"1.2",
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
    "owner_id":3
    
}
```

----------
#### GET `/teachinginstances/:teacher`
- `/teachinginstances/true` palauttaa kurssit, joilla käyttäjä on luonut.
- `/teachinginstances/false` palauttaa kurssit, joille käyttäjä on liittynyt opiskelijaksi.

Request body format: 
```json
{

}
```
Response body format:
```json
{
    "teachinginstances": [
        {
            "coursekey": "uusitesti",
            "coursematerial_name": "MAY2",
            "version": "Kissalan lukio",
            "name": "Kissalan matikka 2019",
            "startdate": "2019-12-27T22:00:00.000Z",
            "enddate": "2030-01-29T22:00:00.000Z",
            "owner_id":3,
            "students":[
                {
                    "firstname":"Kissa",
                    "lastname":"Ankka",
                    "exercises":[
                        {
                            "uuid":"123123-123123-123-123-1123123",
                            "status":"red"
                        },
                        {
                            "uuid":"asd1213-123123-123-123-1123123",
                            "status":"green"
                        }
                    ]
                },
                {
                    "firstname":"Peter",
                    "lastname":"Pan",
                    "exercises":[
                        {
                            "uuid":"123123-123123-123-123-1123123",
                            "status":"yellow"
                        },
                        {
                            "uuid":"asd1213-123123-123-123-1123123",
                            "status":"red"
                        }
                    ]
                 }
            ]

        },
    ]
}
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
    "coursekey": "kissalan lukio",
    "coursematerial_name": "MAY2",
    "version": "Kissalan lukio",
    "name": "Kissalan matikka 2019",
    "startdate": "2019-12-27T22:00:00.000Z",
    "enddate": "2030-01-29T22:00:00.000Z",
    "owner_id":3,
    "students":[
        {
            "firstname":"Kissa",
            "lastname":"Ankka",
            "exercises":[
	    
            ]
        }
    ]
}
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
}
```
------------

------------
#### PUT `/trafficlights/:exercise_uuid` (Liikennevalon klikkaaminen)
- Luo uuden exercisen jos sellaista ei ole.
- Jos sama käyttäjä on klikkaa uudelleen aikaisemmin klikkaamaansa liikennevaloa, päivitetään sen väriä.

Request body format: 
```json
{
	"status":"red",
	"coursekey":"Mäkelänrinteen lukio 9A"
}
```
Response body format:
```json
{
	"message":"Update finished."
}
```
------------

