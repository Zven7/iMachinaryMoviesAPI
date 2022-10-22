# iMachinary Movies and People

To run this project locally:

    cd api
    npm install
    npm start

---

## _This API has the following endpoints:_

## **GET**

### **Get Movies**

/movies

    Endpoint to fetch the full list of Movies.
    Doesn't require any parameters.

---

### **Get People**

/people

    Endpoint to fetch the full list of People.
    Doesn't require any parameters.

---

### **Get Single Movie**

/movies/:id

    Fetch a single Movie passing the ID in the URL

> Example:

    /movies/7

---

### **Get Single Person**

/people/:id

    Fetch a single Person passing the ID in the URL

> Example:

    /people/1

---

## **POST**

### **Add Person**

/people/addPerson

    Person creation endpoint.

> Receives the following parameters via request body:

    name: STRING
    lastName: STRING
    age: INTEGER

> Body example:

```js
{
    "name": "Steven",
    "lastName": "Spielberg",
    "age": 75
}
```

---

### **Add Movie**

/movies/add/movie

    Movie creation endpoint.

> Receives the following parameters via request body:

    title: STRING
    year: INTEGER

> Body example:

```js
{
   "title": "Steven's Car",
   "year": 2021
}
```

---

### **Add Person to Movie**

/movies/add/personToMovie

    This endpoint adds a person to a movie with the specified role.

> Receives the following parameters via request body:

    personID: STRING
    movieID: STRING
    role: STRING

> Body example:

```js
{
    "personID": "d77ca235-64bc-48df-96b9-f8756969c476",
    "movieID": "a2220a0b-ce9c-47b7-9d7e-b21f2a0e1db3",
    "role": "DIR"
}
```
