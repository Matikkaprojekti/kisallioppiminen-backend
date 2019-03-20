# kisallioppiminen-backend

### Ohjeet backendin lokaaliin devauskäyttöön:
1. Asenna postgresql ja luo postgresql käyttäjä
2. `git clone git@github.com:Matikkaprojekti/kisallioppiminen-backend.git && cd kisallioppiminen-backend/`
3. Kopioi .env.example -> .env ja täytä kentät
4. `npm install`
5. node_modules/.bin/knex init
6. node_modules/.bin/knex migrate:latest
7. `npm run watch`
8. Testaa lokaalin backendin toimivuus menemällä [tänne](http://localhost:8000/)

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

Request body format: 
```json
{
	"coursekey":"uusitesti",
	"courseinfo":"Juuh elikkäs joo...",
	"name":"Kissalan matikka 2019",
	"startdate":"28.12.2019",
	"enddate":"30.1.2030",
	"coursematerial_name":"MAY2",
	"coursematerial_version":1.2
	
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
    "enddate": "2030-01-29T22:00:00.000Z"
}
```

------------
#### POST `/teachinginstances/join/:coursekey`
- Require both params.
- coursekey and user_id must be exist in database.

Request body format: 
```json
{
	"user_id": 1,
	"teacher":false
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

