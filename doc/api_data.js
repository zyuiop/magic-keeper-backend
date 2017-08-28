define({ "api": [
  {
    "type": "get",
    "url": "/collection",
    "title": "Get authenticated user Collection",
    "description": "<p>Return the collection of the current user</p>",
    "version": "0.0.1",
    "name": "GetCollection",
    "group": "Collection",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>the access-token provided by auth0</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>auth0 userId of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userCollection",
            "description": "<p>the collection (format: <code>{card-multiverse-id}:{amount},{amount-foil};(...)</code>)</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "public",
            "description": "<p>whether the collection can be accessed by anyone.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "lastChanged",
            "description": "<p>the last time this collection was updated.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>mongo objectid of the collection.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"_id\": \"59a448bb8e0e62edaae4bd89\",\n \"userId\" : \"google-oauth2|369378976795599183570\",\n \"userCollection\" : \"430731:3,0;430733:1,0;430734:2,0;430735:2,0;430736:2,0;430740:1,0;430742:2,0\",\n \"__v\":0,\n \"lastChanged\": \"2017-08-28T17:30:38.251Z\",\n \"public\":true\n}",
          "type": "json"
        },
        {
          "title": "Success-Response with no collection stored:",
          "content": "HTTP/1.1 200 OK\nnull",
          "type": "json"
        }
      ]
    },
    "filename": "api/routes/userCollectionRoutes.js",
    "groupTitle": "Collection"
  },
  {
    "type": "get",
    "url": "/collection/:username",
    "title": "Get an user collection",
    "description": "<p>Return the collection of the user identified by the provided <code>username</code></p>",
    "version": "0.0.1",
    "name": "GetUserCollection",
    "group": "Collection",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>name of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>mongo objectid of the collection.</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "public",
            "description": "<p>whether the collection can be accessed by anyone.</p>"
          }
        ],
        "Public Collection": [
          {
            "group": "Public Collection",
            "type": "String",
            "optional": false,
            "field": "userCollection",
            "description": "<p>the collection (format: <code>{card-multiverse-id}:{amount},{amount-foil};(...)</code>)</p>"
          },
          {
            "group": "Public Collection",
            "type": "Date",
            "optional": false,
            "field": "lastChanged",
            "description": "<p>the last time this collection was updated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response for a public collection:",
          "content": "HTTP/1.1 200 OK\n{\n \"_id\": \"59a448bb8e0e62edaae4bd89\",\n \"username\": \"zyuiop\",\n \"userCollection\": \"430731:3,0;430733:1,0;430734:2,0;430735:2,0;430736:2,0;430740:1,0;430742:2,0\",\n \"lastChanged\": \"2017-08-28T17:30:38.251Z\",\n \"public\": true\n}",
          "type": "json"
        },
        {
          "title": "Success-Response for a private collection:",
          "content": "HTTP/1.1 200 OK\n{\n \"_id\": \"59a448bb8e0e62edaae4bd89\",\n \"username\": \"zyuiop\",\n \"public\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>the user was not found</p>"
          },
          {
            "group": "Error 404",
            "optional": false,
            "field": "CollectionNotFound",
            "description": "<p>the user exists but has no collection</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\", \"message\": \"the user was not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/routes/userCollectionRoutes.js",
    "groupTitle": "Collection"
  },
  {
    "type": "put",
    "url": "/collection",
    "title": "Update User collection",
    "version": "0.0.1",
    "name": "UpdateCollection",
    "group": "Collection",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>the access-token provided by auth0</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": true,
            "field": "collection",
            "description": "<p>{string} the user collection, matching the format detailed before</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "public",
            "description": "<p>{boolean} the collection privacy status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{ \"public\": \"false\" }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nOK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "NoUpdatedField",
            "description": "<p>the request contained no field that could be updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"NoUpdatedField\", \"message\": \"no updated field\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/routes/userCollectionRoutes.js",
    "groupTitle": "Collection"
  },
  {
    "type": "get",
    "url": "/profile",
    "title": "Get User profile",
    "description": "<p>Return the profile of the current user</p>",
    "version": "0.0.1",
    "name": "GetProfile",
    "group": "Profile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>the access-token provided by auth0</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>auth0 userId of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>name of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>mongo objectid of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"userId\": \"auth0|af731fcde45f9713ac3fde\",\n  \"username\": \"zyuiop\",\n  \"_id\": \"78d58e8fc31\",\n}",
          "type": "json"
        },
        {
          "title": "Success-Response with no profile:",
          "content": "HTTP/1.1 200 OK\nnull",
          "type": "json"
        }
      ]
    },
    "filename": "api/routes/userProfileRoutes.js",
    "groupTitle": "Profile"
  },
  {
    "type": "get",
    "url": "/profile/:username",
    "title": "Get an user profile",
    "description": "<p>Return the profile of the user identified by the provided <code>username</code></p>",
    "version": "0.0.1",
    "name": "GetUserProfile",
    "group": "Profile",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>name of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>mongo objectid of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"username\": \"zyuiop\",\n  \"_id\": \"78d58e8fc31\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>the user was not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\", \"message\": \"User not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/routes/userProfileRoutes.js",
    "groupTitle": "Profile"
  },
  {
    "type": "get",
    "url": "/profile/byId/:id",
    "title": "Get an user profile by its id",
    "description": "<p>Return the profile of the user whose mongo _id is <code>id</code></p>",
    "version": "0.0.1",
    "name": "GetUserProfileById",
    "group": "Profile",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>name of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>mongo objectid of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"username\": \"zyuiop\",\n  \"_id\": \"78d58e8fc31\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>the user was not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\", \"message\": \"User not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/routes/userProfileRoutes.js",
    "groupTitle": "Profile"
  },
  {
    "type": "put",
    "url": "/profile",
    "title": "Update User profile",
    "version": "0.0.1",
    "name": "UpdateProfile",
    "group": "Profile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>the access-token provided by auth0</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "username",
            "description": "<p>the username of the user (matches /[a-zA-Z0-9_-]{3,22}/)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{ \"username\": \"my-new-username\" }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nOK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "NoUpdatedField",
            "description": "<p>the request contained no field that could be updated</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "UsernameAlreadyUsed",
            "description": "<p>the chosen username is already used</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "UsernameIsInvalid",
            "description": "<p>the chosen username doesn't match the regex</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"NoUpdatedField\", \"message\": \"no updated field\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/routes/userProfileRoutes.js",
    "groupTitle": "Profile"
  }
] });
