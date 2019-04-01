# kisallioppiminen-backend

### Ohjeet backendin lokaaliin devauskäyttöön:
1. Asenna postgresql ja luo postgresql käyttäjä
2. `git clone git@github.com:Matikkaprojekti/kisallioppiminen-backend.git && cd kisallioppiminen-backend/`
3. Kopioi .env.example -> .env ja täytä kentät
4. `npm install`
5. node_modules/.bin/knex init
6. Luodaan tietokanta komennolla node scripts/createDatabase.js
7. node_modules/.bin/knex migrate:latest
8. `npm run watch`
9. Testaa lokaalin backendin toimivuus menemällä [tänne](http://localhost:8000/)

### Tietokannan kuvaus:

![tietokantakuva](/readme_images/tietokanta.png)

### Tarjolla olevat urlit:

| Metodi(t) | URL                  | Kuvaus                              |
| --------- | ----------------------------------- | --------------------------------------------------------------- |
| GET       | `/users/auth`                       | Authentikoi käyttäjän              				    |
| GET       | `/users/me`                         | Hakee kirjautuneen käyttäjän tiedot				    |
| POST      | `/teachinginstances`		  | Luo uuden opetusinstanssin          			    |
| GET       | `/teachinginstances` 		  | Hakee opetusinstanssit joihin opiskelija on liittynyt           |
| PATCH     | `/teachinginstances` 		  | Liittää käyttäjän opetusinstanssiin 			    |
| PUT       | `/trafficlights/:exercise_uuid`	  | Opiskelija klikkaa liikennevaloa...  			    |

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
------------
#### POST `/trafficlights/`
- Coursekey ei ole case-sensitive. Jos post pyynnössä on isoja kirjaimia ne muutetaan backendissä pieniksi.

Request body format: 
```json
{
	"user_id": 1,
	"status": ["green", "yellow", "red"],
	"coursekey":"kissalan lukio", 
	"exercise_uuid":"asdaasd-asd11sdasd-asdeasd-asdadwasda-asdasdwasd"
	
}
```
Response body format:
```json
{
 "status": ["green", "yellow", "red"]
}
```
Error body format:
- Statuscode 400
```json
{
 "error":"Failed to save your click to database :("
}
```
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

