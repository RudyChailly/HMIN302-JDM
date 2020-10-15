mongoimport --db MOTS --collection termes --file termes.json --jsonArray --drop
mongoimport --db MOTS --collection cacheRelations --file cacheRelations.json --jsonArray --drop

node server.js