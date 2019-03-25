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
| --------- | -------------------- | ----------------------------------- |
| GET       | `/users/auth`        | Authentikoi käyttäjän               |
| GET       | `/users/me`          | Hakee kirjautuneen käyttäjän tiedot |
| POST      | `/teachinginstances` | Luo uuden opetusinstanssin          |
| POST      | `/teachinginstances/join/:coursekey` | Liittää käyttäjän opetusinstanssiin |

-------------

#### POST `/teachinginstances`
- courseinfo is not required
- Coursekey ei ole case-sensitive. Jos post pyynössä on isoja kirjaimia ne muutetaan backendissä pieniksi.

Request body format: 
```json
{
	
	"coursekey":"uusitesti",
	"courseinfo":"Juuh elikkäs joo...",
	"name":"Kissalan matikka 2019",
	"startdate":"28.12.2019",
	"enddate":"30.1.2030",
	"coursematerial_name":"MAY2",
	"coursematerial_version":1.2,
	"user_id":3
	
}
```
Response body format:
```json
{
    "coursekey": "uusitesti",
    "courseinfo": "Juuh elikkäs joo...",
    "coursematerial_name": "MAY2",
    "coursematerial_version": 1.2,
    "name": "Kissalan matikka 2019",
    "startdate": "2019-12-27T22:00:00.000Z",
    "enddate": "2030-01-29T22:00:00.000Z",
    "owner_id":3
    
}
```

----------
#### GET `/teachinginstances/`
teacher(false) = palautetaan opiskelijan omat kurssit. teacher(true) = palautetaan scoreboard.
Request body format: 
```json
{
	"user_id":3,
	"teacher":"true/false"
}
```
Response body format:
```json
{
    "coursekey": "uusitesti",
    "courseinfo": "Juuh elikkäs joo...",
    "coursematerial_name": "MAY2",
    "version": "Kissalan lukio",
    "name": "Kissalan matikka 2019",
    "startdate": "2019-12-27T22:00:00.000Z",
    "enddate": "2030-01-29T22:00:00.000Z",
    "owner_id":3,
	"students":[
		"firstname":"Kissa",
		"lastname":"Ankka",
		"exercises":[
			"uuid":"123123-123123-123-123-1123123",
			"status":"red",
			"uuid":"asd1213-123123-123-123-1123123",
			"status":"green",
		],
		"firstname":"Peter",
		"lastname":"Pan",
		"exercises":[
			"uuid":"123123-123123-123-123-1123123",
			"status":"yellow",
			"uuid":"asd1213-123123-123-123-1123123",
			"status":"red",
		]
		
	]

}
```

------------
#### POST `/teachinginstances/join/`
- Require both params.
- coursekey and user_id must be exist in database.
- Coursekey ei ole case-sensitive. Jos post pyynössä on isoja kirjaimia ne muutetaan backendissä pieniksi.

Request body format: 
```json
{
	"user_id": 1,
	"coursekey":"kissalan lukio"
}
```
Response body format:
```json
{
    "teachinginstance": [
        {
            "user_id": 1,
            "course_coursekey": "kissalankurssiavain2019",
            "teacher": false
        },
        {
            "user_id": 1,
            "course_coursekey": "kissalankurssiavain2019",
            "teacher": true
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


